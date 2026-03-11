import Layout from '../components/Layout';
import { Users, UserRound, Calendar, MessageSquare, ArrowUpRight, Clock, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../services/api';

const StatCard = ({ icon: Icon, label, value, trend, color }) => (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
        <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
            <div className="flex items-center text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-lg">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                {trend}
            </div>
        </div>
        <h3 className="text-gray-500 text-sm font-medium mb-1">{label}</h3>
        <p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        api.get('/stats')
            .then(({ data }) => setStats(data))
            .catch(console.error);
    }, []);

    const statCards = [
        { icon: UserRound, label: 'Manage Users', value: stats?.totalUsers, trend: '+12%', color: 'bg-blue-600' },
        { icon: Users, label: 'Manage Doctors', value: stats?.totalDoctors, trend: '+5%', color: 'bg-indigo-600' },
        { icon: Calendar, label: 'Appointments', value: stats?.totalAppointments, trend: '+20%', color: 'bg-purple-600' },
        { icon: UserRound, label: 'Manage Patients', value: stats?.totalPatients, trend: '+8%', color: 'bg-emerald-600' },
        { icon: MessageSquare, label: 'New Queries', value: stats?.newQueries, trend: '0%', color: 'bg-orange-600' },
    ];

    return (
        <Layout title="Administrator Dashboard">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
                {statCards.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-gray-900">System Activity</h2>
                        <button className="text-blue-600 text-sm font-semibold hover:underline">View All</button>
                    </div>

                    <div className="space-y-6">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex items-start space-x-4">
                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mt-1">
                                    <Clock className="w-5 h-5 text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">User Session Logged</p>
                                    <p className="text-xs text-gray-500 mt-1">Administrator logged in from IP 192.168.1.1</p>
                                    <p className="text-[10px] text-blue-500 font-bold mt-2 uppercase tracking-tighter">2 minutes ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl shadow-xl shadow-blue-100 relative overflow-hidden text-white">
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-4">
                            Welcome Back, {user?.username || 'Admin'}!
                        </h2>
                        <p className="text-blue-100 mb-8 max-w-xs">
                            You have {stats?.newQueries ?? '...'} new queries and {stats?.totalAppointments ?? '...'} appointments recorded. Check your schedule now.
                        </p>
                        <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors">
                            Check Schedule
                        </button>
                    </div>
                    <Activity className="absolute -right-10 -bottom-10 w-64 h-64 text-white opacity-10" />
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
