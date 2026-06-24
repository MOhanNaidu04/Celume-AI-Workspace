import bcrypt from 'bcrypt';
import { query } from './db.js';
import { generateToken } from './auth.js';

export async function registerUser(req, res) {
  try {
    const { username, email, password, fullName } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists with this email or username' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await query(
      `INSERT INTO users (username, email, password_hash, full_name, created_at, updated_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING id, username, email, full_name, created_at`,
      [username, email, hashedPassword, fullName || username]
    );

    const user = result.rows[0];
    const token = generateToken(user.id, user.email);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        createdAt: user.created_at,
      },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed', message: error.message });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const result = await query(
      'SELECT id, username, email, full_name, password_hash, created_at FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user.id, user.email);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        createdAt: user.created_at,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', message: error.message });
  }
}

export async function getCurrentUser(req, res) {
  try {
    const { userId } = req.user;

    const result = await query(
      'SELECT id, username, email, full_name, theme, accent_color, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}

export async function updateUser(req, res) {
  try {
    const { userId } = req.user;
    const { fullName, email, theme, accentColor } = req.body;

    if (email) {
      const existingUser = await query(
        'SELECT id FROM users WHERE email = $1 AND id <> $2',
        [email, userId]
      );

      if (existingUser.rows.length > 0) {
        return res.status(409).json({ error: 'Email is already in use' });
      }
    }

    const result = await query(
      `UPDATE users 
       SET full_name = COALESCE($2, full_name),
           email = COALESCE($3, email),
           theme = COALESCE($4, theme),
           accent_color = COALESCE($5, accent_color),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING id, username, email, full_name, theme, accent_color, updated_at`,
      [userId, fullName, email, theme, accentColor]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user: result.rows[0] });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
}
