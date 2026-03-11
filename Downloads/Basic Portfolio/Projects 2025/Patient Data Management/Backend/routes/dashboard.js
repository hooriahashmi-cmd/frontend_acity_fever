const express = require('express');
const supabase = require('../supabase');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET /stats — dashboard summary counts
router.get('/', authenticate, async (req, res) => {
    try {
        const [
            { count: totalPatients },
            { count: totalDoctors },
            { count: totalAppointments },
            { count: totalUsers },
        ] = await Promise.all([
            supabase.from('patients').select('id', { count: 'exact', head: true }),
            supabase.from('doctors').select('id', { count: 'exact', head: true }),
            supabase.from('appointments').select('id', { count: 'exact', head: true }),
            supabase.from('users').select('id', { count: 'exact', head: true }),
        ]);

        // Count new queries (appointments booked in the last 7 days)
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const { count: newQueries } = await supabase
            .from('appointments')
            .select('id', { count: 'exact', head: true })
            .gte('created_at', sevenDaysAgo);

        res.json({
            totalUsers,
            totalDoctors,
            totalAppointments,
            totalPatients,
            newQueries,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
