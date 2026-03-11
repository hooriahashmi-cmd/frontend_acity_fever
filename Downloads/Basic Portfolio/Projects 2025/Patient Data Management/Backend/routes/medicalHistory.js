const express = require('express');
const supabase = require('../supabase');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET /medical-history/:patientId — get all records for a patient
router.get('/:patientId', authenticate, async (req, res) => {
    const { data, error } = await supabase
        .from('medical_history')
        .select('*')
        .eq('patient_id', req.params.patientId)
        .order('visit_date', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// POST /medical-history — add new medical record
router.post('/', authenticate, async (req, res) => {
    if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Only doctors or admins can add medical records' });
    }

    const { patient_id, blood_pressure, weight, blood_sugar, temperature, prescription, visit_date } = req.body;

    if (!patient_id) return res.status(400).json({ error: 'patient_id is required' });

    const { data, error } = await supabase
        .from('medical_history')
        .insert([{ patient_id, blood_pressure, weight, blood_sugar, temperature, prescription, visit_date }])
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
});

module.exports = router;
