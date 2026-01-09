import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { 
  Ticket, 
  MessageSquare, 
  FolderOpen, 
  CreditCard, 
  Users, 
  LogOut,
  Home,
  UserCircle,
  Bell
} from 'lucide-react';
import { HomeView } from './mobile/HomeView';
import { TicketsView } from './mobile/TicketsView';
import { ChatView } from './mobile/ChatView';
import { ProjectsView } from './mobile/ProjectsView';
import { AccountView } from './mobile/AccountView';
import { UsersView } from './mobile/UsersView';
import { ProfileView } from './mobile/ProfileView';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';

export const MobileApp: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [unreadNotifications, setUnreadNotifications] = useState(3); // Mock notification count

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Calcular el número de tabs visibles
  const visibleTabsCount = [
    true, // tickets
    true, // chat
    user.canViewProjects !== false,
    user.canViewAccount !== false,
    user.canViewUsers !== false
  ].filter(Boolean).length;

  const gridColsClass = `grid-cols-${visibleTabsCount}`;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border shadow-md relative z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://jubbler.tech/assets/img/jubblerFirma.png" 
              alt="Jubbler"
              className="h-8 object-contain"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-foreground hover:bg-secondary"
              onClick={() => setActiveTab('home')}
            >
              <Home className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground hover:bg-secondary relative"
            >
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-white text-xs">
                  {unreadNotifications}
                </Badge>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground hover:bg-secondary"
              onClick={() => setActiveTab('profile')}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/20 text-primary text-xs">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="flex-1 overflow-auto">
            <TabsContent value="home" className="m-0 h-full">
              <HomeView onNavigate={setActiveTab} />
            </TabsContent>
            <TabsContent value="profile" className="m-0 h-full">
              <ProfileView />
            </TabsContent>
            <TabsContent value="tickets" className="m-0 h-full">
              <TicketsView />
            </TabsContent>
            <TabsContent value="chat" className="m-0 h-full">
              <ChatView />
            </TabsContent>
            {user.canViewProjects !== false && (
              <TabsContent value="projects" className="m-0 h-full">
                <ProjectsView />
              </TabsContent>
            )}
            {user.canViewAccount !== false && (
              <TabsContent value="account" className="m-0 h-full">
                <AccountView />
              </TabsContent>
            )}
            {user.canViewUsers !== false && (
              <TabsContent value="users" className="m-0 h-full">
                <UsersView />
              </TabsContent>
            )}
          </div>

          {/* Bottom Navigation - Solo mostrar si NO estamos en home o profile */}
          {activeTab !== 'home' && activeTab !== 'profile' && (
            <TabsList className="w-full h-16 rounded-none border-t border-border bg-card/90 backdrop-blur-sm flex items-center justify-around p-0">
              <TabsTrigger 
                value="tickets" 
                className="flex-1 h-full flex items-center justify-center gap-2 data-[state=active]:text-primary data-[state=active]:bg-primary/10 rounded-none border-r border-border/50 last:border-r-0"
              >
                <Ticket className="h-5 w-5" />
                <span className="text-xs font-medium">Tickets</span>
              </TabsTrigger>
              <TabsTrigger 
                value="chat" 
                className="flex-1 h-full flex items-center justify-center gap-2 data-[state=active]:text-primary data-[state=active]:bg-primary/10 rounded-none border-r border-border/50 last:border-r-0"
              >
                <MessageSquare className="h-5 w-5" />
                <span className="text-xs font-medium">Chat</span>
              </TabsTrigger>
              {user.canViewProjects !== false && (
                <TabsTrigger 
                  value="projects" 
                  className="flex-1 h-full flex items-center justify-center gap-2 data-[state=active]:text-primary data-[state=active]:bg-primary/10 rounded-none border-r border-border/50 last:border-r-0"
                >
                  <FolderOpen className="h-5 w-5" />
                  <span className="text-xs font-medium">Proyectos</span>
                </TabsTrigger>
              )}
              {user.canViewAccount !== false && (
                <TabsTrigger 
                  value="account" 
                  className="flex-1 h-full flex items-center justify-center gap-2 data-[state=active]:text-primary data-[state=active]:bg-primary/10 rounded-none border-r border-border/50 last:border-r-0"
                >
                  <CreditCard className="h-5 w-5" />
                  <span className="text-xs font-medium">Cuenta</span>
                </TabsTrigger>
              )}
              {user.canViewUsers !== false && (
                <TabsTrigger 
                  value="users" 
                  className="flex-1 h-full flex items-center justify-center gap-2 data-[state=active]:text-primary data-[state=active]:bg-primary/10 rounded-none border-r border-border/50 last:border-r-0"
                >
                  <Users className="h-5 w-5" />
                  <span className="text-xs font-medium">Usuarios</span>
                </TabsTrigger>
              )}
            </TabsList>
          )}
        </Tabs>
      </div>
    </div>
  );
};