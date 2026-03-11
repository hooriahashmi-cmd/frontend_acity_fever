import { Home, Users, UserRound, Calendar, FileText, Settings, LogOut, Search } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const menuItems = [
        { icon: <Home className="w-5 h-5" />, label: 'Dashboard', path: '/dashboard' },
        { icon: <Users className="w-5 h-5" />, label: 'Doctors', path: '/doctors' },
        { icon: <UserRound className="w-5 h-5" />, label: 'Users', path: '/users' },
        { icon: <UserRound className="w-5 h-5" />, label: 'Patients', path: '/patients' },
        { icon: <Calendar className="w-5 h-5" />, label: 'Appointments', path: '/appointments' },
        { icon: <FileText className="w-5 h-5" />, label: 'Medical History', path: '/manage-patient-doctor' },
        { icon: <Search className="w-5 h-5" />, label: 'Search', path: '/search' },
    ];

    return (
        <div className="w-64 bg-white h-screen border-r border-gray-100 flex flex-col fixed left-0 top-0">
            <div className="p-6">
                <div className="flex items-center space-x-3 mb-10">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-xl">H</span>
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        HMS Pro
                    </span>
                </div>

                <nav className="space-y-1">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.label}
                            to={item.path}
                            className={({ isActive }) => `
                flex items-center space-x-3 px-4 py-3 rounded-xl transition-all
                ${isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
              `}
                        >
                            {item.icon}
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-gray-50">
                <NavLink
                    to="/login"
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all font-medium"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </NavLink>
            </div>
        </div>
    );
};

export default Sidebar;
