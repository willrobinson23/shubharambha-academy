import { ReactNode } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, Calendar, GraduationCap, MessageSquare, Settings, LogOut, Menu, Star, ImagePlus, Users, Medal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const navItems = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Events", path: "/admin/events", icon: Calendar },
  { label: "News", path: "/admin/news", icon: Calendar },
  { label: "Admissions", path: "/admin/admissions", icon: GraduationCap },
  { label: "Messages", path: "/admin/messages", icon: MessageSquare },
  { label: "Reviews", path: "/admin/reviews", icon: Star },
  { label: "Gallery", path: "/admin/gallery", icon: ImagePlus },
  { label: "Teams", path: "/admin/teams", icon: Users },
  { label: "Support Staff", path: "/admin/support-staff", icon: Users },
  { label: "Achievers", path: "/admin/achievers", icon: Medal },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

export const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { session, isAdmin, loading, signOut } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Skeleton className="h-8 w-48" />
      </div>
    );
  }

  if (!session || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-secondary/30">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-foreground text-background transform transition-transform lg:translate-x-0 lg:static",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-background/10">
          <Link to="/admin" className="flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-gold" />
            <span className="font-display text-lg font-bold">Admin Panel</span>
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground"
                  : "text-background/70 hover:text-background hover:bg-background/10"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Button
            variant="ghost"
            onClick={signOut}
            className="w-full justify-start gap-3 text-background/70 hover:text-background hover:bg-background/10"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-14 border-b bg-background flex items-center px-4 gap-4 sticky top-0 z-20">
          <button className="lg:hidden p-2" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="font-display font-semibold text-lg">
            {navItems.find(n => n.path === location.pathname)?.label || "Admin"}
          </h1>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};
