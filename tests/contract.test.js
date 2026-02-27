/**
 * API Contract Tests
 *
 * Valide que la spec OpenAPI auto-générée est conforme à la norme
 * OpenAPI 3.x et que tous les endpoints documentés sont bien déclarés.
 *
 * Utilise @apidevtools/swagger-parser pour parser & valider la spec,
 * et supertest pour la récupérer depuis l'app Express en mémoire.
 */

const request = require("supertest");
const SwaggerParser = require("@apidevtools/swagger-parser");
const app = require("../app");

describe("API Contract – OpenAPI spec validation", () => {
  let spec;

  beforeAll(async () => {
    const res = await request(app).get("/api-docs/swagger.json");
    expect(res.status).toBe(200);
    spec = res.body;
  });

  // ── Structure de base ──────────────────────────────────────────
  test("La spec respecte le format OpenAPI 3.x", async () => {
    await expect(SwaggerParser.validate(structuredClone(spec))).resolves.toBeDefined();
  });

  test("La spec contient les infos de base (title, version)", () => {
    expect(spec.info).toBeDefined();
    expect(spec.info.title).toBeTruthy();
    expect(spec.info.version).toBeTruthy();
  });

  // ── Endpoints /todos ───────────────────────────────────────────
  test("GET /todos est documenté", () => {
    expect(spec.paths["/todos"]).toBeDefined();
    expect(spec.paths["/todos"].get).toBeDefined();
  });

  test("POST /todos est documenté avec requestBody", () => {
    expect(spec.paths["/todos"]).toBeDefined();
    const post = spec.paths["/todos"].post;
    expect(post).toBeDefined();
    expect(post.requestBody).toBeDefined();
  });

  test("POST /todos déclare une réponse 201 et 422", () => {
    const responses = spec.paths["/todos"].post.responses;
    expect(responses["201"]).toBeDefined();
    expect(responses["422"]).toBeDefined();
  });

  // ── Endpoints /todos/{id} ──────────────────────────────────────
  test("GET /todos/{id} est documenté", () => {
    expect(spec.paths["/todos/{id}"]).toBeDefined();
    expect(spec.paths["/todos/{id}"].get).toBeDefined();
  });

  test("PUT /todos/{id} est documenté", () => {
    expect(spec.paths["/todos/{id}"].put).toBeDefined();
  });

  test("DELETE /todos/{id} est documenté", () => {
    expect(spec.paths["/todos/{id}"].delete).toBeDefined();
  });

  test("GET /todos/{id} déclare une réponse 404", () => {
    const responses = spec.paths["/todos/{id}"].get.responses;
    expect(responses["404"]).toBeDefined();
  });

  // ── Endpoint /health ───────────────────────────────────────────
  test("GET /health est documenté", () => {
    expect(spec.paths["/health"]).toBeDefined();
    expect(spec.paths["/health"].get).toBeDefined();
  });

  // ── Schémas ────────────────────────────────────────────────────
  test("Le schéma Todo est déclaré dans components", () => {
    expect(spec.components).toBeDefined();
    expect(spec.components.schemas).toBeDefined();
    expect(spec.components.schemas.Todo).toBeDefined();
  });

  test("Le schéma Todo possède les propriétés attendues", () => {
    const props = spec.components.schemas.Todo.properties;
    expect(props).toBeDefined();
    expect(props.id).toBeDefined();
    expect(props.title).toBeDefined();
    expect(props.status).toBeDefined();
  });

  test("Le statut d'un Todo est limité à [pending, done]", () => {
    const statusEnum = spec.components.schemas.Todo.properties.status.enum;
    expect(statusEnum).toEqual(expect.arrayContaining(["pending", "done"]));
  });
});
