const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../supabase');

const router = express.Router();

// POST /auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        // Find user by username
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single();

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Compare password
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Sign JWT
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            token,
            user: { id: user.id, username: user.username, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

// POST /auth/register
router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ error: 'Username, password, and role are required' });
    }

    if (!['admin', 'doctor', 'patient'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
    }

    try {
        if (!process.env.JWT_SECRET) {
            console.error('MISSING JWT_SECRET in environment variables');
            return res.status(500).json({ error: 'Server configuration error (JWT)' });
        }

        // Check if user already exists
        const { data: existingUsers, error: checkError } = await supabase
            .from('users')
            .select('username')
            .eq('username', username);

        if (checkError) {
            console.error('Supabase check error:', checkError);
            throw checkError;
        }

        if (existingUsers && existingUsers.length > 0) {
            return res.status(400).json({ error: 'Username already taken' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Insert user
        const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert([{ username, password: passwordHash, role }])
            .select()
            .single();

        if (insertError) {
            console.error('Supabase insert error:', insertError);
            throw insertError;
        }

        // Sign JWT
        const token = jwt.sign(
            { id: newUser.id, username: newUser.username, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.status(201).json({
            token,
            user: { id: newUser.id, username: newUser.username, role: newUser.role }
        });
    } catch (err) {
        console.error('Registration Catch Block Error:', err);
        res.status(500).json({ error: 'Registration failed', details: err.message, stack: process.env.NODE_ENV === 'development' ? err.stack : undefined });
    }
});

// POST /auth/seed — create an initial admin user (run once, then remove or protect)
router.post('/seed', async (req, res) => {
    try {
        const passwordHash = await bcrypt.hash('admin123', 10);
        const { data, error } = await supabase.from('users').insert([
            { username: 'admin', password: passwordHash, role: 'admin' },
            { username: 'doctor1', password: await bcrypt.hash('doctor123', 10), role: 'doctor' },
            { username: 'patient1', password: await bcrypt.hash('patient123', 10), role: 'patient' },
        ]).select();

        if (error) return res.status(400).json({ error: error.message });
        res.json({ message: 'Seed users created', count: data.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
