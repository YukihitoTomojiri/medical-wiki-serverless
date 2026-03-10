
import { Menu, LogOut } from 'lucide-react';
import Logo from '../common/Logo';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
    onMenuClick?: () => void;
    onLogout?: () => void;
}

const Navbar = ({ onMenuClick, onLogout }: NavbarProps) => {
    const { user } = useAuth();

    return (
        <nav className="bg-[#2D1600] h-14 md:h-16 px-4 md:px-6 flex items-center justify-between sticky top-0 z-50 shadow-lg">
            <div className="flex items-center gap-2 md:gap-4 lg:gap-10">
                {/* Mobile Menu Button */}
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 text-white hover:bg-white/10 rounded-lg lg:hidden"
                >
                    <Menu size={24} />
                </button>

                <Logo />
                {/* マイクロコピー：スクショの雰囲気を再現 */}
                <div className="hidden lg:flex items-center gap-2 border-l border-white/10 pl-10 h-10">
                    <span className="text-sm font-medium text-orange-100/70 flex items-center gap-2">
                        <span className="animate-pulse text-orange-400">●</span>
                        想像力で、現場をアップデートする。
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                <button className="text-[10px] md:text-xs font-bold text-orange-100/80 hover:text-white transition-colors tracking-widest hidden sm:block">
                    ABOUT
                </button>
                {user && (
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="flex items-center gap-2 md:gap-3 bg-white/5 py-1 md:py-1.5 px-2 md:px-3 rounded-full border border-white/10 transition-colors hover:bg-white/10 cursor-pointer">
                            <div className="flex flex-col items-end hidden sm:flex">
                                <span className="text-[9px] md:text-[10px] font-bold text-orange-200/60 uppercase tracking-tighter leading-none mb-1">
                                    {user.department || 'Department'}
                                </span>
                                <span className="text-xs font-bold text-white/90 leading-none">
                                    {user.name}
                                </span>
                            </div>
                            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs shadow-sm ring-2 ring-white/20">
                                {user.name.charAt(0)}
                            </div>
                        </div>
                        {/* ログアウトボタン */}
                        <button
                            onClick={onLogout}
                            className="p-2 -mr-2 md:-mr-0 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                            title="ログアウト"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
