const express = require('express');
const supabase = require('../supabase');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET /patients — list all patients
router.get('/', authenticate, async (req, res) => {
    const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// GET /patients/:id — single patient
router.get('/:id', authenticate, async (req, res) => {
    const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', req.params.id)
        .single();

    if (error) return res.status(404).json({ error: 'Patient not found' });
    res.json(data);
});

// POST /patients — add patient
router.post('/', authenticate, async (req, res) => {
    const { name, email, contact, gender, address, age, medical_notes } = req.body;

    if (!name) return res.status(400).json({ error: 'Name is required' });

    const { data, error } = await supabase
        .from('patients')
        .insert([{ name, email, contact, gender, address, age, medical_notes }])
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
});

// PUT /patients/:id — update patient
router.put('/:id', authenticate, async (req, res) => {
    const updates = { ...req.body, updated_at: new Date().toISOString() };

    const { data, error } = await supabase
        .from('patients')
        .update(updates)
        .eq('id', req.params.id)
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// DELETE /patients/:id — delete patient (admin only)
router.delete('/:id', authenticate, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Only admins can delete patients' });
    }

    const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', req.params.id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Patient deleted' });
});

module.exports = router;
