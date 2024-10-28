const express = require('express');
const router = express.Router();

// GET a user by uId
router.get('/:uId', async (req, res) => {
  try {
    const db = req.app.locals.db;
    if (!db) {
      console.error('MongoDB connection not established');
      return res.status(500).json({ error: 'Internal server error' });
    }
    const collection = db.collection('UserData');
    const user = await collection.findOne({ uId: req.params.uId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// GET a user by email
router.get('/getbygmail', async (req, res) => {
  try {
    const db = req.app.locals.db;
    if (!db) {
      console.error('MongoDB connection not established');
      return res.status(500).json({ error: 'Internal server error' });
    }
    const collection = db.collection('UserData');
    const user = await collection.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error finding user by email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST (upsert) a user by uId
router.post('/:uId', async (req, res) => {
  try {
    const db = req.app.locals.db;
    if (!db) {
      console.error('MongoDB connection not established');
      return res.status(500).json({ error: 'Internal server error' });
    }
    const collection = db.collection('UserData');
    const existingUser = await collection.findOne({ uId: req.params.uId });
    if (existingUser) {
      await collection.findOneAndUpdate(
        { uId: req.params.uId },
        { $set: req.body },
        { returnOriginal: false }
      );
    } else {
      await collection.insertOne(req.body);
    }
    const updatedUser = await collection.findOne({ uId: req.params.uId });
    res.json(updatedUser);
  } catch (error) {
    console.error('Error creating or updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// PUT (upsert) a user by uId
router.put('/:uId', async (req, res) => {
  try {
    const db = req.app.locals.db;
    if (!db) {
      console.error('MongoDB connection not established');
      return res.status(500).json({ error: 'Internal server error' });
    }
    const collection = db.collection('UserData');
    const existingUser = await collection.findOne({ uId: req.params.uId });
    if (existingUser) {
      await collection.findOneAndUpdate(
        { uId: req.params.uId },
        { $set: req.body },
        { returnOriginal: false }
      );
    } else {
      await collection.insertOne(req.body);
    }
    const updatedUser = await collection.findOne({ uId: req.params.uId });
    res.json(updatedUser);
  } catch (error) {
    console.error('Error creating or updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// DELETE a user by uId
router.delete('/:uId', async (req, res) => {
  try {
    const db = req.app.locals.db;
    if (!db) {
      console.error('MongoDB connection not established');
      return res.status(500).json({ error: 'Internal server error' });
    }
    const collection = db.collection('UserData');
    await collection.findOneAndDelete({ uId: req.params.uId });
    const activeUsers = await collection.find().toArray();
    res.json(activeUsers);
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
