const client = require('./client.cjs');

const createItem = async (productname, category) => {
  try {
    await client.query(`
      INSERT INTO items (productname, category)
      VALUES ('${productname}', '${category}');
    `);
  } catch (err) {
    console.log(err);
  }
}

const getItems = async () => {
  try {
    const { rows } = await client.query(`
      SELECT * FROM items;
    `);
    return rows;
  } catch (err) {
    console.log(err);
  }
}

const getItemById = async (itemId) => {
  try {
    const { rows } = await client.query(`
      SELECT * FROM items WHERE id = ${itemId};
    `);
    return rows[0];
  } catch (err) {
    console.log(err);
  }
}

const updateItem = async (itemId, newProductname, newCategory) => {
  try {
    await client.query(`
      UPDATE items
      SET productname = '${newProductname}', category = '${newCategory}'
      WHERE id = ${itemId};
    `);
  } catch (err) {
    console.log(err);
  }
}

const deleteItem = async (itemId) => {
  try {
    await client.query(`
      DELETE FROM items WHERE id = ${itemId};
    `);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem
}
