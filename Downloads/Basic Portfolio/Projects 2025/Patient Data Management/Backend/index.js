require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const patientsRoutes = require('./routes/patients');
const appointmentsRoutes = require('./routes/appointments');
const medicalHistoryRoutes = require('./routes/medicalHistory');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
}));
app.use(express.json());

// Health check
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Patient Data Management API is running' });
});

// Routes
app.use('/auth', authRoutes);
app.use('/patients', patientsRoutes);
app.use('/appointments', appointmentsRoutes);
app.use('/medical-history', medicalHistoryRoutes);
app.use('/stats', dashboardRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong', details: err.message });
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🏥 Patient Data API running on port ${PORT}`);
    });
}

module.exports = app;
