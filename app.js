const express = require("express");
const todoRouter = require("./routes/todo");

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const SECRET_KEY = process.env.SECRET_KEY;
const API_KEY = process.env.API_KEY;

const app = express();
app.use(express.json());

app.get("/", (_req, res) => {
  console.log("someone hit the root endpoint")
  res.json({ message: "Welcome to the Enhanced Express Todo App!" });
});

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
        url: "http://localhost:3000",
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
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/todos", todoRouter);

function unusedHelper() {
  var x = 42;
  var tmp = x * 2;
  return tmp;
}

function anotherDeadFunction(data) {
  var result = [];
  for (var i = 0; i < data.length; i++) {
    result.push(data[i]);
  }
  return result;
}

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app;
