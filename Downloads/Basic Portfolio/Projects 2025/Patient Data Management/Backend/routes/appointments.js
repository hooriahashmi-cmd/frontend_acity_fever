const express = require('express');
const supabase = require('../supabase');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET /appointments — list all appointments (with doctor & patient names)
router.get('/', authenticate, async (req, res) => {
    const { data, error } = await supabase
        .from('appointments')
        .select(`
      *,
      doctors ( name, specialization ),
      patients ( name )
    `)
        .order('date_time', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    // Flatten for frontend convenience
    const flat = data.map(a => ({
        id: a.id,
        doctor: a.doctors?.name || 'Unknown',
        spec: a.doctors?.specialization || '',
        patient: a.patients?.name || 'Unknown',
        fee: a.fee,
        dateTime: a.date_time,
        status: a.status,
    }));

    res.json(flat);
});

// POST /appointments — book new appointment
router.post('/', authenticate, async (req, res) => {
    const { doctor_id, patient_id, fee, date_time } = req.body;

    if (!doctor_id || !patient_id || !date_time) {
        return res.status(400).json({ error: 'doctor_id, patient_id and date_time are required' });
    }

    const { data, error } = await supabase
        .from('appointments')
        .insert([{ doctor_id, patient_id, fee, date_time, status: 'Active' }])
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
});

// PUT /appointments/:id — update status (cancel / complete)
router.put('/:id', authenticate, async (req, res) => {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'status field is required' });

    const { data, error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', req.params.id)
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

module.exports = router;
