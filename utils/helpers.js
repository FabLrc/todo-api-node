/**
 * SQL result helpers – shared across the application.
 *
 * sql.js returns query results as { columns: string[], values: any[][] }.
 * These helpers convert them to plain JavaScript objects.
 *
 * @module utils/helpers
 */

/**
 * Convert a sql.js result set to a single plain object.
 *
 * @param {Array} rows - sql.js exec() result (array of { columns, values }).
 * @returns {Object} A plain object with column names as keys.
 */
function toObj(rows) {
  const cols = rows[0].columns;
  const vals = rows[0].values[0];
  const obj = {};
  cols.forEach((c, i) => (obj[c] = vals[i]));
  return obj;
}

/**
 * Convert a sql.js result set to an array of plain objects.
 *
 * @param {Array} rows - sql.js exec() result (array of { columns, values }).
 * @returns {Array<Object>} An array of plain objects.
 */
function toArray(rows) {
  if (!rows.length) return [];
  const cols = rows[0].columns;
  return rows[0].values.map((vals) => {
    const obj = {};
    cols.forEach((c, i) => (obj[c] = vals[i]));
    return obj;
  });
}

module.exports = { toObj, toArray };
