import express from 'express';
import cors from 'cors';
import { query, connect, closePool } from './db/db.js';
import { authMiddleware } from './db/auth.js';
import { registerUser, loginUser, getCurrentUser, updateUser } from './db/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const replies = {
  marketing: 'Use customer outcomes, clear value, and a strong CTA for marketing copy.',
  sales: 'Keep it concise, benefits-led, and reference the customer pain point quickly.',
  hr: 'Build structure around role, culture, and evaluation criteria for HR content.',
  coding: 'Explain the issue clearly, propose steps, and reference the code context.',
  business: 'Focus on impact, growth metrics, and a measurable next action.',
};

// ============ Authentication Endpoints ============

// Register new user
app.post('/api/auth/register', registerUser);

// Login user
app.post('/api/auth/login', loginUser);

// Get current user (protected)
app.get('/api/auth/me', authMiddleware, getCurrentUser);

// Update user profile (protected)
app.put('/api/auth/profile', authMiddleware, updateUser);

// ============ Health Check Endpoints ============

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', environment: 'development', timestamp: new Date().toISOString() });
});

app.get('/api/db/status', async (req, res) => {
  try {
    const result = await query('SELECT NOW()');
    res.json({ 
      status: 'connected', 
      database: 'celume_ai_workspace',
      timestamp: result.rows[0].now 
    });
  } catch (error) {
    res.status(500).json({ status: 'disconnected', error: error.message });
  }
});

// ============ Chat Endpoints ============

app.post('/api/chat', authMiddleware, async (req, res) => {
  try {
    const { prompt, category } = req.body;
    const userId = req.user.userId;
    const baseResponse = replies[category] || 'This looks like a strong prompt. I recommend focusing on clarity and outcome.';

    const response = {
      answer: `${baseResponse} Here is a clean response for your prompt: ${prompt}`,
      category: category || 'general',
      createdAt: new Date().toISOString(),
    };

    // Save to database
    const chatQuery = `
      INSERT INTO chats (user_id, title, category_id, last_message, created_at, updated_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id, title, created_at;
    `;
    const chatResult = await query(chatQuery, [userId, prompt.substring(0, 100), category, response.answer]);
    response.chatId = chatResult.rows[0].id;

    // Simulate a small processing delay
    setTimeout(() => {
      res.json(response);
    }, 700);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await query('SELECT * FROM categories ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user chats (protected)
app.get('/api/chats', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await query(
      `SELECT c.*, ct.label as category_label 
       FROM chats c 
       LEFT JOIN categories ct ON c.category_id = ct.id 
       WHERE c.user_id = $1 
       ORDER BY c.updated_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get chat messages (protected)
app.get('/api/chats/:chatId/messages', authMiddleware, async (req, res) => {
  try {
    const { chatId } = req.params;
    const result = await query(
      'SELECT * FROM messages WHERE chat_id = $1 ORDER BY created_at ASC',
      [chatId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get prompt templates
app.get('/api/prompts', async (req, res) => {
  try {
    const result = await query('SELECT * FROM prompt_templates ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user projects (protected)
app.get('/api/projects', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await query(
      'SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user tasks (protected)
app.get('/api/tasks', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await query(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize server
async function startServer() {
  try {
    // Connect to database
    const isConnected = await connect();
    
    if (!isConnected) {
      console.warn('Warning: Database not available, running in demo mode');
    }

    app.listen(PORT, () => {
      console.log(`Backend server listening on http://localhost:${PORT}`);
      if (isConnected) {
        console.log('Database: celume_ai_workspace connected');
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await closePool();
  process.exit(0);
});

startServer();
