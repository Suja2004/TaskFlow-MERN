const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Models
const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}));

const Todo = mongoose.model('Todo', new mongoose.Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}));

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Middleware to authenticate users using JWT
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.sendStatus(403);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// User registration
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: 'Username already taken' });
        }

        // Hash the password and save the new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ message: 'Error registering user' });
    }
});

// User login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
        return res.status(401).json({ message: 'User not registered' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET);
    res.json({ token });
});


// Get all to-do items for the authenticated user
app.get('/todos', authenticateJWT, async (req, res) => {
    const todos = await Todo.find({ userId: req.user.id });
    res.json(todos);
});

// Create a new to-do item
app.post('/todos', authenticateJWT, async (req, res) => {
    const newTodo = new Todo({
        text: req.body.text,
        userId: req.user.id,
    });
    await newTodo.save();
    res.status(201).json(newTodo);
});

// Update a to-do item
app.put('/todos/:id', authenticateJWT, async (req, res) => {
    const { id } = req.params;
    const todo = await Todo.findById(id);

    if (!todo || todo.userId.toString() !== req.user.id) {
        return res.status(404).json({ message: 'To-do item not found or not authorized' });
    }

    todo.text = req.body.text !== undefined ? req.body.text : todo.text;
    todo.completed = req.body.completed !== undefined ? req.body.completed : todo.completed;

    await todo.save();
    res.json(todo);
});

// Toggle completion status of a to-do item
app.put('/todos/:id/complete', authenticateJWT, async (req, res) => {
    const { id } = req.params;
    const todo = await Todo.findById(id);

    if (!todo || todo.userId.toString() !== req.user.id) {
        return res.status(404).json({ message: 'To-do item not found or not authorized' });
    }

    todo.completed = !todo.completed;
    await todo.save();
    res.json(todo);
});

// Delete a to-do item
app.delete('/todos/:id', authenticateJWT, async (req, res) => {
    const { id } = req.params;
    const todo = await Todo.findById(id);

    if (!todo || todo.userId.toString() !== req.user.id) {
        return res.status(404).json({ message: 'To-do item not found or not authorized' });
    }

    await Todo.deleteOne({ _id: id });
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
