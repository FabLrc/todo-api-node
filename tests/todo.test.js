const request = require("supertest");
const path = require("path");
const fs = require("fs");

// Set test environment
process.env.NODE_ENV = "test";

const app = require("../app");

// Clean up the DB file after all tests
afterAll(() => {
  const dbPath = path.join(__dirname, "..", "todo.db");
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }
});

// ──────────────────────────────────────────────
// GET /
// ──────────────────────────────────────────────
describe("GET /", () => {
  it("should return 200 with a welcome message", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
  });
});

// ──────────────────────────────────────────────
// GET /api-docs
// ──────────────────────────────────────────────
describe("GET /api-docs", () => {
  it("should return 301/302/200 (redirect or page)", async () => {
    const res = await request(app).get("/api-docs");
    expect([200, 301, 302]).toContain(res.statusCode);
  });

  it("should return the swagger spec as JSON", async () => {
    const res = await request(app).get("/api-docs/swagger.json");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("openapi");
    expect(res.body.info.title).toBe("Enhanced Express Todo API");
  });
});

// ──────────────────────────────────────────────
// GET /health
// ──────────────────────────────────────────────
describe("GET /health", () => {
  it("should return 200 with status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body).toHaveProperty("uptime");
    expect(typeof res.body.uptime).toBe("number");
  });
});

// ──────────────────────────────────────────────
// POST /todos
// ──────────────────────────────────────────────
describe("POST /todos", () => {
  it("should create a todo with title only", async () => {
    const res = await request(app)
      .post("/todos")
      .send({ title: "First todo" });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe("First todo");
    expect(res.body.status).toBe("pending");
    expect(res.body.description).toBeNull();
  });

  it("should create a todo with all fields", async () => {
    const res = await request(app)
      .post("/todos")
      .send({ title: "Full todo", description: "A description", status: "done" });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Full todo");
    expect(res.body.description).toBe("A description");
    expect(res.body.status).toBe("done");
  });

  it("should return 422 when title is missing", async () => {
    const res = await request(app).post("/todos").send({});
    expect(res.statusCode).toBe(422);
    expect(res.body).toHaveProperty("detail");
    expect(res.body.detail).toBe("title is required");
  });

  it("should return 422 when body is empty", async () => {
    const res = await request(app).post("/todos").send();
    expect(res.statusCode).toBe(422);
  });
});

// ──────────────────────────────────────────────
// GET /todos
// ──────────────────────────────────────────────
describe("GET /todos", () => {
  it("should return an array of todos", async () => {
    const res = await request(app).get("/todos");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should respect the limit query param", async () => {
    const res = await request(app).get("/todos?limit=1");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeLessThanOrEqual(1);
  });

  it("should respect skip and limit together", async () => {
    const allRes = await request(app).get("/todos?limit=100");
    const skippedRes = await request(app).get("/todos?skip=1&limit=100");
    expect(skippedRes.body.length).toBe(allRes.body.length - 1);
  });

  it("should return empty array when skip exceeds total", async () => {
    const res = await request(app).get("/todos?skip=99999&limit=10");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });
});

// ──────────────────────────────────────────────
// GET /todos/:id
// ──────────────────────────────────────────────
describe("GET /todos/:id", () => {
  let todoId;

  beforeAll(async () => {
    const res = await request(app)
      .post("/todos")
      .send({ title: "Todo for GET by id", description: "some desc" });
    todoId = res.body.id;
  });

  it("should return the todo by id", async () => {
    const res = await request(app).get(`/todos/${todoId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(todoId);
    expect(res.body.title).toBe("Todo for GET by id");
    expect(res.body.description).toBe("some desc");
  });

  it("should return 404 for a non-existent id", async () => {
    const res = await request(app).get("/todos/99999");
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("detail");
  });
});

// ──────────────────────────────────────────────
// PUT /todos/:id
// ──────────────────────────────────────────────
describe("PUT /todos/:id", () => {
  let todoId;

  beforeAll(async () => {
    const res = await request(app)
      .post("/todos")
      .send({ title: "Todo to update", description: "original desc", status: "pending" });
    todoId = res.body.id;
  });

  it("should update the title while keeping other fields", async () => {
    const res = await request(app)
      .put(`/todos/${todoId}`)
      .send({ title: "Updated title" });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated title");
    expect(res.body.description).toBe("original desc");
    expect(res.body.status).toBe("pending");
  });

  it("should update the status", async () => {
    const res = await request(app)
      .put(`/todos/${todoId}`)
      .send({ status: "done" });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("done");
  });

  it("should update all fields at once", async () => {
    const res = await request(app)
      .put(`/todos/${todoId}`)
      .send({ title: "All new", description: "new desc", status: "pending" });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("All new");
    expect(res.body.description).toBe("new desc");
    expect(res.body.status).toBe("pending");
  });

  it("should return 404 for a non-existent id", async () => {
    const res = await request(app)
      .put("/todos/99999")
      .send({ title: "Ghost" });
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("detail");
  });
});

// ──────────────────────────────────────────────
// DELETE /todos/:id
// ──────────────────────────────────────────────
describe("DELETE /todos/:id", () => {
  let todoId;

  beforeAll(async () => {
    const res = await request(app)
      .post("/todos")
      .send({ title: "Todo to delete" });
    todoId = res.body.id;
  });

  it("should delete the todo and return confirmation", async () => {
    const res = await request(app).delete(`/todos/${todoId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.detail).toBe("Todo deleted");
  });

  it("should return 404 when fetching the deleted todo", async () => {
    const res = await request(app).get(`/todos/${todoId}`);
    expect(res.statusCode).toBe(404);
  });

  it("should return 404 for a non-existent id", async () => {
    const res = await request(app).delete("/todos/99999");
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("detail");
  });
});

// ──────────────────────────────────────────────
// GET /todos/search/all
// ──────────────────────────────────────────────
describe("GET /todos/search/all", () => {
  beforeAll(async () => {
    await request(app).post("/todos").send({ title: "Searchable apple item" });
    await request(app).post("/todos").send({ title: "Searchable banana item" });
  });

  it("should return results matching the query", async () => {
    const res = await request(app).get("/todos/search/all?q=apple");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    const titles = res.body.map((t) => t.title);
    expect(titles.some((t) => t.includes("apple"))).toBe(true);
  });

  it("should return all todos when q is empty", async () => {
    const allRes = await request(app).get("/todos?limit=100");
    const searchRes = await request(app).get("/todos/search/all");
    expect(searchRes.statusCode).toBe(200);
    expect(searchRes.body.length).toBe(allRes.body.length);
  });

  it("should return empty array when no match", async () => {
    const res = await request(app).get("/todos/search/all?q=xyznonexistent123");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });
});
