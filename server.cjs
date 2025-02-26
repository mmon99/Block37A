require('dotenv').config({path:__dirname+'/../.env'});

const client = require('./db/client.cjs');
const jwt = require('jsonwebtoken');
client.connect();

const express = require('express');
const app = express();

const { createUser, getUser, getUserByToken } = require('./db/users.cjs');
const { createItem, getItems, getItemById } = require('./db/items.cjs');
const { createReview, getReviewsForItem, getReviewsByUser } = require('./db/reviews.cjs');

app.use(express.json());

app.get('/', (req, res, next) => {
  res.send('Welcome to Review App');
});

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.json({ message: 'Access Denied' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.json({ message: 'Invalid' });
    }
    req.user = user;
    next();
  });
};

app.post('/api/v1/users', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    await createUser(username, password);
    res.json({ message: 'User created successfully' });
  } catch (err) {
    res.json({ message: 'Error creating user', error: err });
  }
});

app.post('/api/v1/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await getUser(username, password); 
    if (!user) {
      return res.json({ message: 'Invalid Credentials' });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.json({ message: 'Log In Error', error: err });
  }
});

app.get('/api/v1/login', authenticateToken, async (req, res, next) => {
  try {
    const user = await getUserByToken(req.user.userId);
    res.json(user);
  } catch (err) {
    res.json({ message: 'Error user info', error: err });
  }
});

app.post('/api/v1/items', authenticateToken, async (req, res, next) => {
  try {
    const { productname, category } = req.body;
    await createItem(productname, category);
    res.json({ message: 'Item created successfully' });
  } catch (err) {
    res.json({ message: 'Error creating item', error: err });
  }
});

app.get('/api/v1/items', async (req, res, next) => {
  try {
    const items = await getItems();
    res.json(items);
  } catch (err) {
    res.json({ message: 'Error No items', error: err });
  }
});

app.get('/api/v1/items/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const item = await getItemById(id);
    res.json(item);
  } catch (err) {
    res.json({ message: 'Error No item', error: err });
  }
});

app.post('/api/v1/reviews', authenticateToken, async (req, res, next) => {
  try {
    const { rating, itemId } = req.body;
    const userId = req.user.userId; 
    if (rating < 1 || rating > 5) {
      return res.json({ message: 'Rating must be between 1 and 5' });
    }
    await createReview(rating, userId, itemId);
    res.json({ message: 'Review created successfully' });
  } catch (err) {
    res.json({ message: 'Error creating review', error: err });
  }
});

app.get('/api/v1/reviews/items/:itemId', async (req, res, next) => {
  const { itemId } = req.params;
  try {
    const reviews = await getReviewsForItem(itemId);
    res.json(reviews);
  } catch (err) {
    res.json({ message: 'Error No reviews for item', error: err });
  }
});

app.get('/api/v1/reviews/users/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const reviews = await getReviewsByUser(userId);
    res.json(reviews);
  } catch (err) {
    res.json({ message: 'Error No reviews by user', error: err });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`It is running on port ${port}`);
});
