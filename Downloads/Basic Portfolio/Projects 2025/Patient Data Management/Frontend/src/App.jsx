import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import ManagePatientDoctor from './pages/ManagePatientDoctor';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/manage-patient-doctor" element={<ManagePatientDoctor />} />

                {/* Redirect for other nav links for demo purposes */}
                <Route path="/doctors" element={<Dashboard />} />
                <Route path="/users" element={<Dashboard />} />
                <Route path="/history" element={<ManagePatientDoctor />} />
                <Route path="/search" element={<Dashboard />} />
                <Route path="/settings" element={<Dashboard />} />

                <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
