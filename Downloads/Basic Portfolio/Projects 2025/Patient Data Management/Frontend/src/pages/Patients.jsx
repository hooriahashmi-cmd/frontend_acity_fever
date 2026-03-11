import Layout from '../components/Layout';
import { Filter, Eye, Edit2, Plus, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../services/api';

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/patients')
            .then(({ data }) => setPatients(data))
            .catch((err) => setError(err.response?.data?.error || 'Failed to load patients'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <Layout title="Manage Patients">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                        <h2 className="text-xl font-bold text-gray-900">All Patients</h2>
                        <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded-lg">
                            {loading ? '...' : `${patients.length} Total`}
                        </span>
                    </div>

                    <div className="flex items-center space-x-3">
                        <button className="flex items-center space-x-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors text-sm font-medium">
                            <Filter className="w-4 h-4" />
                            <span>Filter</span>
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-bold shadow-lg shadow-blue-100">
                            <Plus className="w-4 h-4" />
                            <span>Add Patient</span>
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20 text-gray-400">
                        <Loader2 className="w-6 h-6 animate-spin mr-2" />
                        Loading patients...
                    </div>
                ) : error ? (
                    <div className="text-center py-20 text-red-500 font-medium">{error}</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 text-gray-500 uppercase text-[10px] tracking-wider font-bold">
                                    <th className="px-6 py-4">#</th>
                                    <th className="px-6 py-4">Patient Name</th>
                                    <th className="px-6 py-4">Contact Number</th>
                                    <th className="px-6 py-4">Gender</th>
                                    <th className="px-6 py-4">Creation Date</th>
                                    <th className="px-6 py-4">Update Date</th>
                                    <th className="px-6 py-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-sm">
                                {patients.map((patient, idx) => (
                                    <tr key={patient.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-gray-400">{idx + 1}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
                                                    {patient.name.charAt(0)}
                                                </div>
                                                <span className="font-semibold text-gray-900">{patient.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 font-medium">{patient.contact || '—'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${patient.gender === 'Female' ? 'bg-pink-50 text-pink-600' : 'bg-blue-50 text-blue-600'}`}>
                                                {patient.gender || '—'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{patient.created_at?.split('T')[0] || '—'}</td>
                                        <td className="px-6 py-4 text-gray-500">{patient.updated_at?.split('T')[0] || '—'}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center space-x-2">
                                                <button className="p-2 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-all">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 rounded-lg transition-all">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {patients.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-16 text-center text-gray-400">No patients found. Add your first patient.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="p-6 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
                    <p>Showing {patients.length} patients</p>
                </div>
            </div>
        </Layout>
    );
};

export default Patients;
