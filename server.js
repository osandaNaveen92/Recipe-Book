const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // To handle base64 image

// Connect to MongoDB
mongoose.connect('mongodb+srv://naveen-RecipeBook:RX1pvg2XiUPv2SQb@cluster0.r5kedax.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

// Recipe Schema
const Recipe = mongoose.model('Recipe', new mongoose.Schema({
  name: String,
  ingredients: [String],
  steps: String,
  image: String // base64 string or URL
}), 'recipes'); // <-- Explicitly set collection name to 'recipes'

// POST: Add Recipe
app.post('/recipes', async (req, res) => {
  try {
    const recipe = new Recipe(req.body); // Creates a new Recipe document with the data from the request body
    await recipe.save();                 // Saves the document to the MongoDB 'recipes' collection
    res.status(201).json(recipe);        // Responds with the saved recipe
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: All Recipes
app.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search Recipes
app.get('/search', async (req, res) => {
  const query = req.query.q.toLowerCase();
  try {
    const recipes = await Recipe.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { ingredients: { $elemMatch: { $regex: query, $options: 'i' } } }
      ]
    });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
