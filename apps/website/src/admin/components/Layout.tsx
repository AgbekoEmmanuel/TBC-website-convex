import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Calendar, Video, ShoppingCart, Megaphone, HeartHandshake, Settings, Menu, X, Bell, Search, Sun, Moon, Shield, LogOut } from "lucide-react";
import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "./ThemeProvider";
import { useAuth, Role } from "./AuthProvider";
import { cn } from "../lib/utils";
import logo from "../images/tbc_logo_full.png";

const NAV_ITEMS: { name: string; path: string; icon: any; roles: Role[] }[] = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard, roles: ['admin', 'editor'] },
  { name: "Events", path: "/admin/events", icon: Calendar, roles: ['admin', 'editor'] },
  { name: "Sermons", path: "/admin/sermons", icon: Video, roles: ['admin', 'editor'] },
  { name: "Store", path: "/admin/store", icon: ShoppingCart, roles: ['admin'] },
  { name: "Announcements", path: "/admin/announcements", icon: Megaphone, roles: ['admin', 'editor'] },
  { name: "Donations", path: "/admin/donations", icon: HeartHandshake, roles: ['admin'] },
  { name: "Settings", path: "/admin/settings", icon: Settings, roles: ['admin'] },
];

function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (val: boolean) => void }) {
  const location = useLocation();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  
  // For the merged app, we'll assume admin role for now or use the passcode auth state
  const authorizedNavItems = NAV_ITEMS; 

  const handleSignOut = () => {
    signOut();
    navigate("/admin/login");
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-[#112a46] dark:bg-[#07243c] px-0 py-4 transition-transform md:static md:translate-x-0 w-[260px] shrink-0 text-slate-300 shadow-xl md:shadow-none transition-colors overflow-hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col items-center mb-1 mt-2 px-4 w-full">
          <Link to="/admin" className="flex items-center justify-center w-full mb-1">
             <img src={logo} className="w-[180px] h-auto object-contain invert brightness-200 mix-blend-screen" />
          </Link>
          <p className="text-[9px] text-[#648496] mt-0.5 uppercase tracking-widest font-bold text-center leading-tight whitespace-nowrap">CHURCH ADMINISTRATION</p>
          
          <button onClick={() => setIsOpen(false)} className="md:hidden absolute top-4 right-4 p-2 rounded-md hover:bg-white/10 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 mt-1 overflow-hidden">
          {authorizedNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-4 px-8 py-2.5 text-[14px] font-medium transition-all relative group",
                  isActive
                    ? "text-white bg-[#0a1e33]/50 dark:bg-[#0a1e33]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
                onClick={() => setIsOpen(false)}
              >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#85c9d8]" />}
                <Icon className={cn("w-5 h-5", isActive ? "text-[#85c9d8]" : "text-[#55697c] group-hover:text-slate-300")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-6 pb-3 pt-3 flex flex-col gap-1 w-full relative shrink-0">
          <div className="absolute top-0 left-0 right-0 h-px bg-white/5" />
           <Link 
             to="/admin/management" 
             className={cn(
               "flex w-full items-center gap-4 px-2 py-3 text-[14px] font-medium transition-colors rounded-lg mt-2",
               location.pathname === '/admin/management' 
                 ? "text-white bg-[#0a1e33]/50 dark:bg-[#0a1e33]" 
                 : "text-slate-400 hover:text-white hover:bg-white/5"
             )}
             onClick={() => setIsOpen(false)}
           >
              <Shield className={cn("w-5 h-5", location.pathname === '/admin/management' ? "text-[#85c9d8]" : "text-[#55697c]")} /> Admin Management
           </Link>
           <button 
             onClick={handleSignOut}
             className="flex w-full items-center gap-4 px-2 py-3 text-[14px] font-medium text-slate-400 hover:text-red-400 dark:hover:bg-transparent transition-colors rounded-lg group"
           >
              <LogOut className="w-5 h-5 text-[#55697c] group-hover:text-red-400" /> Sign Out
           </button>
        </div>
      </motion.aside>
    </>
  );
}

function Topbar({ setIsSidebarOpen }: { setIsSidebarOpen: (val: boolean) => void }) {
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  const currentNavItem = NAV_ITEMS.find(item => item.path === location.pathname);
  const pageTitle = currentNavItem?.name || (location.pathname === '/admin/management' ? 'Admin Management' : 'Dashboard');

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between bg-white dark:bg-[#031c34] px-4 sm:px-8 border-b border-slate-200 dark:border-transparent transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <h2 className="hidden md:block font-bold text-slate-900 dark:text-white text-[15px] min-w-[160px]">
          {pageTitle}
        </h2>

        <div className="hidden sm:flex items-center relative w-full justify-start max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-slate-400 dark:text-slate-400/80" />
          <input
            type="search"
            placeholder="Search..."
            className="h-10 w-full rounded-full border border-slate-200 dark:border-transparent bg-slate-50 dark:bg-[#0a2744] pl-11 pr-4 py-2 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 dark:focus-visible:ring-cyan-600/50 placeholder:text-slate-400 dark:placeholder:text-[#648496] text-slate-900 dark:text-white shadow-sm dark:shadow-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 sm:gap-4 flex-1">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-[#0a2744] text-slate-500 dark:text-[#55697c] transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 fill-current" /> : <Moon className="w-5 h-5 fill-current" />}
        </button>
        
        <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-[#0a2744] text-slate-500 dark:text-[#55697c] transition-colors relative mr-1">
          <Bell className="w-5 h-5 fill-current" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#1aa1c9] border-2 border-slate-100 dark:border-[#031c34]"></span>
        </button>

        <div className="flex items-center gap-2 pl-4 border-l border-slate-300 dark:border-white/5">
           <div className="h-8 w-8 rounded-full overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm shrink-0">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=100&h=100&q=80" alt="David H." className="w-full h-full object-cover" />
           </div>
           <span className="text-[13px] font-medium text-slate-800 dark:text-white hidden md:block">Administrator</span>
        </div>
      </div>
    </header>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-background font-sans text-foreground overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-slate-50 dark:bg-[#031c34] transition-colors">
        <Topbar setIsSidebarOpen={setIsSidebarOpen} />
        
        <main className="flex-1 overflow-auto p-4 sm:p-8 md:p-10">
           <AnimatePresence mode="wait">
             <motion.div
                key={useLocation().pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
             >
                {children}
             </motion.div>
           </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
