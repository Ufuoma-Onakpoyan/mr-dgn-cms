import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  LogOut,
  Menu
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

const navigation = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Blog Posts', url: '/blog', icon: FileText },
  { title: 'Portfolio', url: '/portfolio', icon: Briefcase },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { signOut } = useAuth();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50";

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarContent>
        <div className="p-4">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/65b6d2f7-e96d-44d6-885f-198109c566d2.png" 
              alt="MrDgn" 
              className="h-8 w-8"
            />
            <div>
              <h2 className="font-bold text-sidebar-foreground">MrDgn</h2>
              <p className="text-xs text-sidebar-foreground/70">Admin Panel</p>
            </div>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="text-sidebar-foreground">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4">
          <Button
            variant="outline"
            size="default"
            onClick={handleSignOut}
            className="w-full"
          >
            <LogOut className="h-4 w-4" />
            <span className="ml-2 text-sidebar-foreground">Sign Out</span>
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}