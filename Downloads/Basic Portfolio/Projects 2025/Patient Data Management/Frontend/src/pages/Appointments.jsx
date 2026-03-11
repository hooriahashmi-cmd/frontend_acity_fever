import Layout from '../components/Layout';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../services/api';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/appointments')
            .then(({ data }) => setAppointments(data))
            .catch((err) => setError(err.response?.data?.error || 'Failed to load appointments'))
            .finally(() => setLoading(false));
    }, []);

    const handleCancel = async (id) => {
        try {
            await api.put(`/appointments/${id}`, { status: 'Cancelled by Doctor' });
            setAppointments(prev =>
                prev.map(a => a.id === id ? { ...a, status: 'Cancelled by Doctor' } : a)
            );
        } catch (err) {
            alert('Failed to cancel appointment');
        }
    };

    const getStatusStyle = (status) => {
        if (status === 'Active') return 'bg-green-50 text-green-600';
        if (status?.includes('Cancelled')) return 'bg-red-50 text-red-600';
        return 'bg-gray-50 text-gray-600';
    };

    const filtered = filter === 'All'
        ? appointments
        : appointments.filter(a => filter === 'Pending' ? a.status === 'Active' : a.status !== 'Active');

    return (
        <Layout title="Appointment History">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Patients Appointments</h2>
                    <div className="flex bg-gray-50 p-1 rounded-xl">
                        {['All', 'Pending', 'Completed'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f ? 'bg-white text-blue-600 shadow-sm font-bold' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20 text-gray-400">
                        <Loader2 className="w-6 h-6 animate-spin mr-2" />
                        Loading appointments...
                    </div>
                ) : error ? (
                    <div className="text-center py-20 text-red-500 font-medium">{error}</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 text-gray-500 uppercase text-[10px] tracking-wider font-bold">
                                    <th className="px-6 py-4">#</th>
                                    <th className="px-6 py-4">Doctor Name</th>
                                    <th className="px-6 py-4">Patient Name</th>
                                    <th className="px-6 py-4">Specialization</th>
                                    <th className="px-6 py-4">Consultancy Fee</th>
                                    <th className="px-6 py-4">Date / Time</th>
                                    <th className="px-6 py-4">Current Status</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-sm">
                                {filtered.map((app, idx) => {
                                    const dt = app.dateTime ? new Date(app.dateTime) : null;
                                    return (
                                        <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 text-gray-400">{idx + 1}</td>
                                            <td className="px-6 py-4 font-semibold text-gray-900">{app.doctor}</td>
                                            <td className="px-6 py-4 text-gray-700">{app.patient}</td>
                                            <td className="px-6 py-4 text-gray-500">{app.spec}</td>
                                            <td className="px-6 py-4 font-bold text-gray-900">${app.fee}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-gray-900 font-medium">
                                                        {dt ? dt.toLocaleDateString() : '—'}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400">
                                                        {dt ? dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${getStatusStyle(app.status)}`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {app.status === 'Active' ? (
                                                    <button
                                                        onClick={() => handleCancel(app.id)}
                                                        className="text-red-600 text-xs font-bold hover:underline"
                                                    >
                                                        Cancel
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-300 text-xs font-medium italic">No action</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-16 text-center text-gray-400">No appointments found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Appointments;
