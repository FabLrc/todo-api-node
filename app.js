const express = require("express");
const todoRouter = require("./routes/todo");

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Welcome to the Enhanced Express Todo App!" });
});

const SERVER_URL = process.env.API_URL || `http://localhost:${process.env.PORT || 3000}`;

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Enhanced Express Todo API",
      version: "1.0.0",
      description: "API REST pour gérer une application Todo avec Express et SQLite",
    },
    servers: [
      {
        url: SERVER_URL,
      },
    ],
    components: {
      schemas: {
        Todo: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            title: { type: "string", example: "Acheter du lait" },
            description: { type: "string", nullable: true, example: "Acheter du lait entier à l'épicerie" },
            status: { type: "string", enum: ["pending", "done"], example: "pending" },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

// Expose the spec as JSON (required for swagger-ui-express v5 behind a reverse proxy)
app.get("/api-docs/swagger.json", (_req, res) => res.json(specs));
app.use("/api-docs", swaggerUi.serve);
app.get("/api-docs", swaggerUi.setup(null, {
  swaggerOptions: { url: "/api-docs/swagger.json" },
}));

app.use("/todos", todoRouter);

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app;
