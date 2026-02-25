const { Router } = require("express");
const database = require("../database/database");
const { toObj, toArray } = require("../utils/helpers");

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "Acheter du lait"
 *         description:
 *           type: string
 *           nullable: true
 *           example: "Acheter du lait entier à l'épicerie"
 *         status:
 *           type: string
 *           enum: [pending, done]
 *           example: pending
 */

/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Créer un todo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Acheter du lait"
 *               description:
 *                 type: string
 *                 example: "Acheter du lait entier à l'épicerie"
 *               status:
 *                 type: string
 *                 enum: [pending, done]
 *                 default: pending
 *     responses:
 *       201:
 *         description: Todo créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       422:
 *         description: Titre manquant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 detail:
 *                   type: string
 *                   example: "title is required"
 */
// POST /todos
router.post("/", async (req, res, next) => {
  try {
    const { title, description = null, status = "pending" } = req.body;
    if (!title) {
      return res.status(422).json({ detail: "title is required" });
    }
    const db = await database.getDb();
    db.run("INSERT INTO todos (title, description, status) VALUES (?, ?, ?)", [title, description, status]);
    const id = db.exec("SELECT last_insert_rowid() as id")[0].values[0][0];
    const row = db.exec("SELECT * FROM todos WHERE id = ?", [id]);
    database.saveDb();
    const todo = toObj(row);
    res.status(201).json(todo);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Liste des todos
 *     parameters:
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Liste de todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 */
// GET /todos
router.get("/", async (req, res, next) => {
  try {
    const skip = Number.parseInt(req.query.skip) || 0;
    const limit = Number.parseInt(req.query.limit) || 10;
    const db = await database.getDb();
    const rows = db.exec("SELECT * FROM todos LIMIT ? OFFSET ?", [limit, skip]);
    const todos = toArray(rows);
    res.json(todos);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /todos/{id}:
 *   get:
 *     summary: Récupérer un todo par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Todo trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 detail:
 *                   type: string
 *                   example: "Todo not found"
 */
// GET /todos/:id
router.get("/:id", async (req, res, next) => {
  try {
    const db = await database.getDb();
    const rows = db.exec("SELECT * FROM todos WHERE id = ?", [req.params.id]);
    if (!rows.length || !rows[0].values.length) return res.status(404).json({ detail: "Todo not found" });
    res.json(toObj(rows));
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /todos/{id}:
 *   put:
 *     summary: Mettre à jour un todo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, done]
 *     responses:
 *       200:
 *         description: Todo mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 detail:
 *                   type: string
 *                   example: "Todo not found"
 */
// PUT /todos/:id
router.put("/:id", async (req, res, next) => {
  try {
    const db = await database.getDb();
    const existing = db.exec("SELECT * FROM todos WHERE id = ?", [req.params.id]);
    if (!existing.length || !existing[0].values.length) return res.status(404).json({ detail: "Todo not found" });

    const old = toObj(existing);
    const title = req.body.title ?? old.title;
    const description = req.body.description ?? old.description;
    const status = req.body.status ?? old.status;

    db.run("UPDATE todos SET title = ?, description = ?, status = ? WHERE id = ?", [title, description, status, req.params.id]);
    const rows = db.exec("SELECT * FROM todos WHERE id = ?", [req.params.id]);
    database.saveDb();
    res.json(toObj(rows));
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: Supprimer un todo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Todo supprimé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 detail:
 *                   type: string
 *                   example: "Todo deleted"
 *       404:
 *         description: Todo non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 detail:
 *                   type: string
 *                   example: "Todo not found"
 */
// DELETE /todos/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const db = await database.getDb();
    const existing = db.exec("SELECT * FROM todos WHERE id = ?", [req.params.id]);
    if (!existing.length || !existing[0].values.length) return res.status(404).json({ detail: "Todo not found" });
    db.run("DELETE FROM todos WHERE id = ?", [req.params.id]);
    database.saveDb();
    res.json({ detail: "Todo deleted" });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /todos/search/all:
 *   get:
 *     summary: Rechercher des todos par titre
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *           default: ""
 *     responses:
 *       200:
 *         description: Liste des todos correspondant à la recherche
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 */
// search endpoint
router.get("/search/all", async (req, res, next) => {
  try {
    const query = req.query.q || "";
    const db = await database.getDb();
    const results = db.exec("SELECT * FROM todos WHERE title LIKE ?", [`%${query}%`]);
    res.json(toArray(results));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
