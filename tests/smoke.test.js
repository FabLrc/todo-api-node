/**
 * Smoke Tests – post-deploy
 *
 * - En CI (release.yml) : SMOKE_URL pointe vers le conteneur Docker lancé.
 *   Les tests vérifient l'app réelle sans démarrer de serveur interne.
 *
 * - En local (sans SMOKE_URL) : le serveur Express est démarré en interne
 *   sur un port libre. Aucune app déployée nécessaire.
 */

const app = require("../app");

const EXTERNAL_URL = process.env.SMOKE_URL;

let server;
let BASE_URL;

beforeAll((done) => {
  if (EXTERNAL_URL) {
    // CI : on cible le conteneur déployé, aucun serveur à démarrer
    BASE_URL = EXTERNAL_URL;
    done();
  } else {
    // Local : on démarre l'app Express sur un port libre
    server = app.listen(0, () => {
      BASE_URL = `http://localhost:${server.address().port}`;
      done();
    });
  }
});

afterAll((done) => {
  if (server) {
    server.close(done);
  } else {
    done();
  }
});

describe("Smoke Tests", () => {
  // ── Santé de l'application ─────────────────────────────────────
  test("GET / retourne un message de bienvenue (200)", async () => {
    const res = await fetch(`${BASE_URL}/`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("message");
  });

  test("GET /health retourne status ok (200)", async () => {
    const res = await fetch(`${BASE_URL}/health`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("ok");
    expect(typeof body.uptime).toBe("number");
  });

  // ── CRUD Todos ─────────────────────────────────────────────────
  test("GET /todos retourne un tableau (200)", async () => {
    const res = await fetch(`${BASE_URL}/todos`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test("POST /todos crée un todo (201)", async () => {
    const res = await fetch(`${BASE_URL}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Smoke test – todo de vérification" }),
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body).toHaveProperty("id");
    expect(body.title).toBe("Smoke test – todo de vérification");
    expect(body.status).toBe("pending");
  });

  test("POST /todos sans titre retourne 422", async () => {
    const res = await fetch(`${BASE_URL}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body).toHaveProperty("detail");
  });

  test("GET /todos/:id inexistant retourne 404", async () => {
    const res = await fetch(`${BASE_URL}/todos/999999`);
    expect(res.status).toBe(404);
  });

  // ── Spec OpenAPI disponible ────────────────────────────────────
  test("GET /api-docs/swagger.json retourne une spec OpenAPI 3 (200)", async () => {
    const res = await fetch(`${BASE_URL}/api-docs/swagger.json`);
    expect(res.status).toBe(200);
    const spec = await res.json();
    expect(spec).toHaveProperty("openapi");
    expect(spec.openapi).toMatch(/^3\./);
  });
});
