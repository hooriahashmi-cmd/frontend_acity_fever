import Layout from '../components/Layout';
import { Activity, Clipboard, Calendar, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const ManagePatientDoctor = () => {
    // Try to get a patientId from the URL, otherwise default to the first patient
    const { patientId } = useParams();

    const [patient, setPatient] = useState(null);
    const [medicalHistory, setMedicalHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                // If no patientId in URL, load the first patient
                let pid = patientId;
                if (!pid) {
                    const { data: patients } = await api.get('/patients');
                    if (patients.length === 0) {
                        setError('No patients found in the database.');
                        setLoading(false);
                        return;
                    }
                    pid = patients[0].id;
                    setPatient(patients[0]);
                } else {
                    const { data } = await api.get(`/patients/${pid}`);
                    setPatient(data);
                }

                const { data: history } = await api.get(`/medical-history/${pid}`);
                setMedicalHistory(history);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load patient data');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [patientId]);

    if (loading) {
        return (
            <Layout title="Doctor | Manage Patients">
                <div className="flex items-center justify-center py-32 text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    Loading patient data...
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout title="Doctor | Manage Patients">
                <div className="text-center py-32 text-red-500 font-medium">{error}</div>
            </Layout>
        );
    }

    return (
        <Layout title="Doctor | Manage Patients">
            <div className="space-y-8">
                {/* Patient Details Section */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                            <Clipboard className="w-5 h-5 mr-3 text-blue-600" />
                            Patient Details
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12 px-2">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Patient Name</p>
                            <p className="text-gray-900 font-semibold text-lg">{patient?.name}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Patient Email</p>
                            <p className="text-gray-900 font-semibold">{patient?.email || '—'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Patient Mobile Number</p>
                            <p className="text-gray-900 font-semibold">{patient?.contact || '—'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Patient Address</p>
                            <p className="text-gray-900 font-semibold">{patient?.address || '—'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Patient Gender</p>
                            <span className={`px-2 py-1 text-[10px] font-bold rounded-lg uppercase ${patient?.gender === 'Female' ? 'bg-pink-50 text-pink-600' : 'bg-blue-50 text-blue-600'}`}>
                                {patient?.gender || '—'}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Patient Age</p>
                            <p className="text-gray-900 font-semibold">{patient?.age || '—'}</p>
                        </div>
                    </div>

                    {patient?.medical_notes && (
                        <div className="mt-8 pt-8 border-t border-gray-50">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Patient Medical History (if any)</p>
                            <p className="text-gray-700 bg-gray-50 p-4 rounded-xl italic">{patient.medical_notes}</p>
                        </div>
                    )}
                </div>

                {/* Medical History Table */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-50">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                            <Activity className="w-5 h-5 mr-3 text-blue-600" />
                            Medical History
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 text-gray-500 uppercase text-[10px] tracking-wider font-bold">
                                    <th className="px-8 py-4">#</th>
                                    <th className="px-8 py-4">Blood Pressure</th>
                                    <th className="px-8 py-4">Weight</th>
                                    <th className="px-8 py-4">Blood Sugar</th>
                                    <th className="px-8 py-4">Body Temp</th>
                                    <th className="px-8 py-4 w-1/3">Medical Prescription</th>
                                    <th className="px-8 py-4">Visit Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-sm">
                                {medicalHistory.map((row, i) => (
                                    <tr key={row.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-6 text-gray-400 font-medium">{i + 1}</td>
                                        <td className="px-8 py-6 font-semibold text-gray-900">{row.blood_pressure}</td>
                                        <td className="px-8 py-6 text-gray-600">{row.weight}</td>
                                        <td className="px-8 py-6 text-gray-600">{row.blood_sugar}</td>
                                        <td className="px-8 py-6 text-gray-600">{row.temperature}</td>
                                        <td className="px-8 py-6 text-blue-600 font-medium bg-blue-50/30">{row.prescription}</td>
                                        <td className="px-8 py-6 text-gray-500 flex items-center">
                                            <Calendar className="w-4 h-4 mr-2 opacity-40" />
                                            {row.visit_date}
                                        </td>
                                    </tr>
                                ))}
                                {medicalHistory.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-8 py-16 text-center text-gray-400">No medical history records found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ManagePatientDoctor;
