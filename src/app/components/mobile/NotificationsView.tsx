import React from 'react';
import { Notification } from '../../types';
import { Card } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { 
  MessageSquare, 
  Ticket, 
  FolderKanban, 
  UserCheck,
  Bell
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface NotificationsViewProps {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({ 
  notifications,
  onNotificationClick 
}) => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'NEW_MESSAGE':
        return <MessageSquare className="h-6 w-6 text-primary" />;
      case 'TICKET_UPDATE':
        return <Ticket className="h-6 w-6 text-chart-3" />;
      case 'PROJECT_UPDATE':
        return <FolderKanban className="h-6 w-6 text-chart-2" />;
      case 'USER_APPROVED':
        return <UserCheck className="h-6 w-6 text-chart-4" />;
      default:
        return <Bell className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { 
        addSuffix: true,
        locale: es 
      });
    } catch (error) {
      return '';
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 px-6 text-center">
        <Bell className="h-20 w-20 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No tienes notificaciones
        </h3>
        <p className="text-sm text-muted-foreground">
          Cuando recibas nuevas notificaciones, aparecerán aquí
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-3">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={`p-4 cursor-pointer transition-all ${
              notification.read 
                ? 'bg-card border-border opacity-70' 
                : 'bg-primary/5 border-primary/20 shadow-sm'
            }`}
            onClick={() => onNotificationClick(notification)}
          >
            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className={`font-semibold text-sm ${
                    notification.read ? 'text-muted-foreground' : 'text-foreground'
                  }`}>
                    {notification.title}
                  </h4>
                  {!notification.read && (
                    <span className="flex-shrink-0 h-2 w-2 rounded-full bg-primary mt-1.5" />
                  )}
                </div>
                <p className={`text-sm mb-2 ${
                  notification.read ? 'text-muted-foreground' : 'text-foreground'
                }`}>
                  {notification.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatTimestamp(notification.timestamp)}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};
