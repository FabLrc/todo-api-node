const request = require("supertest");
const app = require("../app");

describe("GET /", () => {
  it("should return a welcome message", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
  });
});

describe("POST /todos", () => {
  it("should create a todo", async () => {
    const res = await request(app).post("/todos").send({ title: "Test todo" });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe("Test todo");
  });

  it("should return 422 if title is missing", async () => {
    const res = await request(app).post("/todos").send({});
    expect(res.statusCode).toBe(422);
  });
});

describe("GET /todos", () => {
  it("should return a list of todos", async () => {
    const res = await request(app).get("/todos");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
