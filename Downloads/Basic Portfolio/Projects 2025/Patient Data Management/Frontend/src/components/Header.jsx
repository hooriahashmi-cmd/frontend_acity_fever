import { Bell, Search, User, ChevronDown } from 'lucide-react';

const Header = ({ title }) => {
    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10 ml-64">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>

            <div className="flex items-center space-x-6">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all w-64 text-sm"
                    />
                </div>

                <button className="relative w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-all">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="h-8 w-[1px] bg-gray-100 mx-2"></div>

                <button className="flex items-center space-x-3 group">
                    <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                        <User className="w-5 h-5" />
                    </div>
                    <div className="text-left hidden sm:block">
                        <p className="text-sm font-bold text-gray-900 leading-none">Hooria Hashmi</p>
                        <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-semibold">Administrator</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-900 transition-colors" />
                </button>
            </div>
        </header>
    );
};

export default Header;
