import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Brain, 
  Headphones, 
  Calendar, 
  UserCheck, 
  Trophy, 
  Film, 
  Settings,
  Menu,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Film, label: "Video Generator", path: "/video" },
    { icon: Brain, label: "AI Mind Games", path: "/games" },
    { icon: Headphones, label: "AI Audiobooks", path: "/audiobooks" },
    { icon: Calendar, label: "Schedule", path: "/schedule" },
    { icon: UserCheck, label: "Attendance", path: "/attendance" },
    { icon: Trophy, label: "Leaderboard", path: "/leaderboard" },
    
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <aside 
      className={`glass-panel border-r border-border/30 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      } flex flex-col`}
    >
      <div className="p-6 flex items-center justify-between">
        {!collapsed && (
          <h1 className="text-2xl font-bold neon-glow">Smartboard</h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="hover:bg-primary/20"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      <nav className="flex-1 px-3 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-primary/20 text-primary border border-primary/50"
                    : "text-muted-foreground hover:bg-muted/20 hover:text-foreground"
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/30 space-y-3">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className={`w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 ${
            collapsed ? "px-2" : ""
          }`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="ml-3">Logout</span>}
        </Button>
        {!collapsed && (
          <div className="text-center text-xs text-muted-foreground">
            <p>Metaverse Classroom v1.0</p>
            <p className="mt-1">Powered by AI</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;