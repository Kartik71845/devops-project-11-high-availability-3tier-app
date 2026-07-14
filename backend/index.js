const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

const users = [];
const habits = [];
const SECRET = 'secret123';

app.post('/api/auth/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
  const hashed = await bcrypt.hash(password, 10);
  const user = { id: Date.now().toString(), email, password: hashed };
  users.push(user);
  res.status(201).json({ message: 'User created' });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// CREATE HABIT: Now includes a 'history' array for dates
app.post('/api/habits', authenticateToken, (req, res) => {
  const { name } = req.body;
  const habit = { id: Date.now().toString(), userId: req.user.id, name, history: [] };
  habits.push(habit);
  res.status(201).json(habit);
});

// GET HABITS
app.get('/api/habits', authenticateToken, (req, res) => {
  const userHabits = habits.filter(h => h.userId === req.user.id);
  res.json(userHabits);
});

// MARK COMPLETE: Saves the current Date
app.put('/api/habits/:id', authenticateToken, (req, res) => {
  const habit = habits.find(h => h.id === req.params.id && h.userId === req.user.id);
  if (!habit) return res.sendStatus(404);
  
  const today = new Date().toISOString().split('T')[0];
  if (!habit.history.includes(today)) {
    habit.history.push(today);
  }
  res.json(habit);
});
app.get('/api/health', (req, res) => {
  res.status(200).send('OK');
});
app.listen(5000, "0.0.0.0", () => console.log('Server running on 5000'));
