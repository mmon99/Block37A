const client = require('./client.cjs');

const createReview = async (rating, userId, itemId) => {
  try {
    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }
    await client.query(`
      INSERT INTO reviews (rating, user_id, item_id)
      VALUES (${rating}, ${userId}, ${itemId});
    `);
  } catch (err) {
    console.log(err);
  }
}

const getReviewsForItem = async (itemId) => {
  try {
    const { rows } = await client.query(`
      SELECT reviews.rating, users.username, reviews.user_id
      FROM reviews
      JOIN users ON reviews.user_id = users.id
      WHERE reviews.item_id = ${itemId};
    `);
    return rows;
  } catch (err) {
    console.log(err);
  }
}

const getReviewsByUser = async (userId) => {
  try {
    const { rows } = await client.query(`
      SELECT reviews.rating, items.productname, reviews.item_id
      FROM reviews
      JOIN items ON reviews.item_id = items.id
      WHERE reviews.user_id = ${userId};
    `);
    return rows;
  } catch (err) {
    console.log(err);
  }
}

const updateReview = async (reviewId, newRating) => {
  try {
    if (newRating < 1 || newRating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }
    await client.query(`
      UPDATE reviews
      SET rating = ${newRating}
      WHERE id = ${reviewId};
    `);
  } catch (err) {
    console.log(err);
  }
}

const deleteReview = async (reviewId) => {
  try {
    await client.query(`
      DELETE FROM reviews WHERE id = ${reviewId};
    `);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  createReview,
  getReviewsForItem,
  getReviewsByUser,
  updateReview,
  deleteReview
}
