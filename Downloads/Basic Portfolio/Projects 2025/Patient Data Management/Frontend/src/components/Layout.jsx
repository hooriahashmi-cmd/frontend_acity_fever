import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children, title }) => {
    return (
        <div className="min-h-screen bg-[#fcfdff]">
            <Sidebar />
            <div className="flex flex-col flex-1">
                <Header title={title} />
                <main className="ml-64 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
