import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent } from '../ui/card';
import { GalaxyBackground } from '../GalaxyBackground';
import { 
  Ticket, 
  MessageSquare, 
  FolderOpen, 
  CreditCard, 
  Users
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  if (!user) return null;

  const menuItems = [
    {
      id: 'tickets',
      label: 'Tickets',
      icon: Ticket,
      color: 'bg-chart-1',
      enabled: true
    },
    {
      id: 'chat',
      label: 'Chat',
      icon: MessageSquare,
      color: 'bg-chart-2',
      enabled: true
    },
    {
      id: 'projects',
      label: 'Proyectos',
      icon: FolderOpen,
      color: 'bg-chart-3',
      enabled: user.canViewProjects !== false // Por defecto true si no está definido
    },
    {
      id: 'account',
      label: 'Cuenta',
      icon: CreditCard,
      color: 'bg-chart-4',
      enabled: user.canViewAccount !== false // Por defecto true si no está definido
    },
    {
      id: 'users',
      label: 'Usuarios',
      icon: Users,
      color: 'bg-chart-5',
      enabled: user.canViewUsers !== false // Por defecto true si no está definido
    }
  ].filter(item => item.enabled);

  return (
    <div className="h-full bg-background overflow-auto relative">
      {/* Galaxy Background */}
      <GalaxyBackground />
      
      {/* Content */}
      <div className="relative z-10 p-4 max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Bienvenido, {user.name}</h1>
          <p className="text-sm text-purple-200">Selecciona una opción para comenzar</p>
        </div>

        <div className="space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <Card
                key={item.id}
                className="cursor-pointer hover:scale-[1.02] transition-all duration-200 bg-card/80 backdrop-blur-sm border-2 border-border hover:border-primary shadow-lg"
                onClick={() => onNavigate(item.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`${item.color} p-3 rounded-xl shadow-lg flex-shrink-0`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{item.label}</h3>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};