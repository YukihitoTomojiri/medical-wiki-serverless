
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
        <nav className="bg-[#2D1600] h-16 px-6 flex items-center justify-between sticky top-0 z-50 shadow-lg">
            <div className="flex items-center gap-4 md:gap-10">
                {/* Mobile Menu Button */}
                <button
                    onClick={onMenuClick}
                    className="p-1 text-white hover:bg-white/10 rounded-lg lg:hidden"
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

            <div className="flex items-center gap-4">
                <button className="text-xs font-bold text-orange-100/80 hover:text-white transition-colors tracking-widest hidden sm:block">
                    ABOUT
                </button>
                {user && (
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3 bg-white/5 py-1.5 pl-4 pr-1.5 rounded-full border border-white/10 transition-colors hover:bg-white/10 cursor-pointer shadow-sm">
                            <div className="hidden md:flex flex-col items-end mr-1">
                                <div className="text-[10px] text-orange-200/80 mb-0.5 tracking-wider leading-none">
                                    {user.facility || '未設定機関'} {user.department || ''}
                                </div>
                                <div className="text-sm font-bold text-white leading-none flex items-baseline gap-1">
                                    {user.name} <span className="text-[10px] font-normal text-white/70">様でログイン中</span>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs shadow-sm ring-2 ring-white/20 shrink-0" title={`${user.name} (${user.facility} ${user.department})`}>
                                {user.name.charAt(0)}
                            </div>
                        </div>
                        {/* ログアウトボタン */}
                        <button
                            onClick={onLogout}
                            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
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
