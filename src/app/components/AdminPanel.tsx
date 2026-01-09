import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockUsers, mockCompanies, mockChats, mockTickets, mockProjects } from '../mock-data';
import { User, Chat, ChatMessage } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DashboardView } from './admin/DashboardView';
import { 
  LogOut, 
  Users, 
  Building2, 
  MessageSquare, 
  Send,
  Check,
  X,
  Image as ImageIcon,
  FileText,
  Mic,
  Paperclip,
  ExternalLink,
  Ticket,
  FolderKanban,
  Search,
  LayoutDashboard
} from 'lucide-react';
import { toast } from 'sonner';

export const AdminPanel: React.FC = () => {
  const { user: currentUser, logout } = useAuth();
  const [activeView, setActiveView] = useState<'dashboard' | 'users' | 'companies' | 'chats'>('dashboard');
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messageText, setMessageText] = useState('');
  const [chatStatusFilter, setChatStatusFilter] = useState<'ALL' | 'ACTIVE' | 'PENDING_OUTSIDE_HOURS' | 'CLOSED'>('ALL');
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [selectedCompanyForDetails, setSelectedCompanyForDetails] = useState<string | null>(null);
  const [detailsView, setDetailsView] = useState<'tickets' | 'projects' | null>(null);
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [ticketSearchQuery, setTicketSearchQuery] = useState('');
  const [ticketUserFilter, setTicketUserFilter] = useState<string>('all');
  const [projectSearchQuery, setProjectSearchQuery] = useState('');

  if (!currentUser || currentUser.role !== 'SUPERADMIN') {
    return null;
  }

  const pendingUsers = users.filter(u => u.status === 'PENDING');

  const handleApproveUser = (userId: string) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, status: 'APPROVED' } : u
    ));
    toast.success('Usuario aprobado exitosamente');
  };

  const handleRejectUser = (userId: string) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, status: 'REJECTED' } : u
    ));
    toast.success('Usuario rechazado');
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedChat) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      chatId: selectedChat.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderType: 'AGENT',
      type: 'TEXT',
      content: messageText,
      timestamp: new Date().toISOString(),
      read: false
    };

    const updatedChat = {
      ...selectedChat,
      messages: [...selectedChat.messages, newMessage],
      lastMessage: messageText,
      lastMessageTime: newMessage.timestamp
    };

    setChats(chats.map(c => c.id === selectedChat.id ? updatedChat : c));
    setSelectedChat(updatedChat);
    setMessageText('');
  };

  const handleCloseChat = () => {
    if (!selectedChat) return;

    const updatedChat = {
      ...selectedChat,
      status: 'CLOSED' as const,
      closedAt: new Date().toISOString()
    };

    setChats(chats.map(c => c.id === selectedChat.id ? updatedChat : c));
    setSelectedChat(updatedChat);
    toast.success('Conversación cerrada');
  };

  const handleActivateChat = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;

    const updatedChat = {
      ...chat,
      status: 'ACTIVE' as const
    };

    setChats(chats.map(c => c.id === chatId ? updatedChat : c));
    setSelectedChat(updatedChat);
    toast.success('Chat activado y en atención');
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (message: ChatMessage) => {
    const isAgent = message.senderType === 'AGENT';

    return (
      <div
        key={message.id}
        className={`flex ${isAgent ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`max-w-[70%]`}>
          {!isAgent && (
            <div className="text-xs text-muted-foreground mb-1">{message.senderName}</div>
          )}
          <div
            className={`rounded-lg px-4 py-2 ${
              isAgent
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground'
            }`}
          >
            {message.type === 'TEXT' && <p>{message.content}</p>}
            
            {message.type === 'IMAGE' && (
              <div>
                <img
                  src={message.fileUrl}
                  alt={message.fileName}
                  className="rounded mb-2 max-w-full"
                />
                <p className="text-sm">{message.content}</p>
              </div>
            )}

            {message.type === 'PDF' && (
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6" />
                <div>
                  <p className="text-sm font-medium">{message.fileName}</p>
                </div>
              </div>
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-1 text-right">
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border shadow-lg relative z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src="https://jubbler.tech/assets/img/jubblerFirma.png" 
              alt="Jubbler"
              className="h-10 object-contain"
            />
            <div className="border-l border-border pl-4">
              <h1 className="text-2xl font-bold text-primary">Panel de Administración</h1>
              <p className="text-sm text-muted-foreground">Gestión Centralizada</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-foreground">{currentUser.name}</span>
            <Button variant="ghost" size="sm" onClick={logout} className="text-foreground hover:bg-secondary">
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
        <div className="px-6 flex gap-2 pb-4">
          <Button
            variant={activeView === 'dashboard' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('dashboard')}
            className={activeView === 'dashboard' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-secondary'}
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <Button
            variant={activeView === 'chats' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('chats')}
            className={activeView === 'chats' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-secondary'}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Chats {chats.filter(c => c.unreadCount > 0).length > 0 && (
              <Badge className="ml-2 bg-destructive text-white">{chats.filter(c => c.unreadCount > 0).length}</Badge>
            )}
          </Button>
          <Button
            variant={activeView === 'users' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('users')}
            className={activeView === 'users' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-secondary'}
          >
            <Users className="h-4 w-4 mr-2" />
            Usuarios {pendingUsers.length > 0 && (
              <Badge className="ml-2 bg-chart-3 text-white">{pendingUsers.length}</Badge>
            )}
          </Button>
          <Button
            variant={activeView === 'companies' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('companies')}
            className={activeView === 'companies' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-secondary'}
          >
            <Building2 className="h-4 w-4 mr-2" />
            Clientes
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {/* Chat View */}
        {activeView === 'chats' && (() => {
          // Apply filters to chats
          const filteredChats = chats.filter(c => {
            // Filter by status
            if (chatStatusFilter !== 'ALL' && c.status !== chatStatusFilter) return false;
            return true;
          });

          return (
          <div className="h-full flex">
            {/* Chat List - 25% */}
            <div className="w-1/4 border-r border-border bg-card flex flex-col">
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-foreground">Conversaciones</h3>
                  </div>
                  
                  {/* Status Filter */}
                  <Select value={chatStatusFilter} onValueChange={(v) => setChatStatusFilter(v as any)}>
                    <SelectTrigger className="bg-background border-border text-foreground h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="ALL" className="text-foreground">
                        Todas ({chats.length})
                      </SelectItem>
                      <SelectItem value="ACTIVE" className="text-foreground">
                        Activas ({chats.filter(c => c.status === 'ACTIVE').length})
                      </SelectItem>
                      <SelectItem value="PENDING_OUTSIDE_HOURS" className="text-foreground">
                        Fuera de horario ({chats.filter(c => c.status === 'PENDING_OUTSIDE_HOURS').length})
                      </SelectItem>
                      <SelectItem value="CLOSED" className="text-foreground">
                        Cerradas ({chats.filter(c => c.status === 'CLOSED').length})
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <ScrollArea className="flex-1">
                  <div className="p-2 space-y-2">
                    {filteredChats.map(chat => (
                      <Card
                        key={chat.id}
                        className={`p-3 cursor-pointer hover:bg-secondary transition-colors border-border ${
                          selectedChat?.id === chat.id ? 'border-l-4 border-primary bg-secondary' : ''
                        }`}
                        onClick={() => setSelectedChat(chat)}
                      >
                        <div className="flex items-start gap-2">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/20 text-primary text-xs">
                              {chat.userName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium text-sm truncate text-foreground">{chat.userName}</p>
                              {chat.unreadCount > 0 && (
                                <Badge className="bg-primary text-primary-foreground h-5 w-5 flex items-center justify-center p-0 text-xs">
                                  {chat.unreadCount}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{chat.companyName}</p>
                            <p className="text-xs text-muted-foreground truncate mt-1">{chat.lastMessage}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>

            {/* Chat Messages - 50% */}
            <div className="flex-1 flex flex-col bg-card">
              {selectedChat ? (
                <>
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {selectedChat.userName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-foreground">{selectedChat.userName}</h3>
                        <p className="text-sm text-muted-foreground">{selectedChat.companyName}</p>
                        {selectedChat.subject && (
                          <p className="text-xs text-muted-foreground italic">{selectedChat.subject}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline"
                        className={
                          selectedChat.status === 'ACTIVE' 
                            ? 'bg-chart-4/20 text-chart-4 border-chart-4/30'
                            : selectedChat.status === 'CLOSED'
                            ? 'bg-muted text-muted-foreground border-border'
                            : 'bg-chart-3/20 text-chart-3 border-chart-3/30'
                        }
                      >
                        {selectedChat.status === 'ACTIVE' && 'Activo'}
                        {selectedChat.status === 'CLOSED' && 'Cerrado'}
                        {selectedChat.status === 'PENDING_OUTSIDE_HOURS' && 'Fuera de horario'}
                      </Badge>
                      {selectedChat.status === 'PENDING_OUTSIDE_HOURS' && (
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-primary hover:bg-primary/90"
                          onClick={() => handleActivateChat(selectedChat.id)}
                        >
                          Atender Ahora
                        </Button>
                      )}
                      {selectedChat.status === 'ACTIVE' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleCloseChat}
                        >
                          Cerrar Conversación
                        </Button>
                      )}
                    </div>
                  </div>

                  <ScrollArea className="flex-1 p-4">
                    {selectedChat.messages.map(message => renderMessage(message))}
                  </ScrollArea>

                  {selectedChat.status === 'ACTIVE' && (
                    <div className="p-4 border-t border-border">
                      <div className="flex gap-2 mb-2">
                        <Button variant="outline" size="sm" className="border-border hover:bg-secondary">
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="border-border hover:bg-secondary">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="border-border hover:bg-secondary">
                          <Mic className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Escribe un mensaje..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          className="bg-input-background border-border text-foreground"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                        <Button onClick={handleSendMessage} disabled={!messageText.trim()} className="bg-primary hover:bg-primary/90">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-20" />
                    <p>Selecciona una conversación</p>
                  </div>
                </div>
              )}
            </div>

            {/* Client Details - 25% */}
            <div className="w-1/4 border-l border-border bg-muted p-4">
              {selectedChat ? (
                <div>
                  <h3 className="font-semibold mb-4 text-foreground">Detalles del Cliente</h3>
                  <div className="text-center mb-6">
                    <Avatar className="h-20 w-20 mx-auto mb-3">
                      <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                        {selectedChat.userName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <h4 className="font-medium text-foreground">{selectedChat.userName}</h4>
                    <p className="text-sm text-muted-foreground">{selectedChat.userEmail}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Button className="w-full bg-primary hover:bg-primary/90" variant="outline" size="sm">
                      Ver Tickets
                    </Button>
                    <Button className="w-full bg-primary hover:bg-primary/90" variant="outline" size="sm">
                      Proyectos Actuales
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  <p className="text-sm">No hay cliente seleccionado</p>
                </div>
              )}
            </div>
          </div>
        )})()}

        {/* Users View */}
        {activeView === 'users' && (() => {
          const filteredUsers = companyFilter === 'all' 
            ? users 
            : users.filter(u => u.companyId === companyFilter);
          const filteredPendingUsers = filteredUsers.filter(u => u.status === 'PENDING');

          return (
            <div className="h-full overflow-auto p-6">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Gestión de Usuarios</h2>
                  <div className="w-64">
                    <Select value={companyFilter} onValueChange={setCompanyFilter}>
                      <SelectTrigger className="bg-card border-border text-foreground">
                        <SelectValue placeholder="Filtrar por empresa" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="all" className="text-foreground">Todas las empresas</SelectItem>
                        {mockCompanies.map(company => (
                          <SelectItem key={company.id} value={company.id} className="text-foreground">
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {filteredPendingUsers.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-foreground">
                      Usuarios Pendientes de Aprobación ({filteredPendingUsers.length})
                    </h3>
                    <div className="grid gap-4">
                      {filteredPendingUsers.map(user => {
                        const company = mockCompanies.find(c => c.id === user.companyId);
                        return (
                          <Card key={user.id} className="p-4 bg-card border-border">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-12 w-12">
                                <AvatarFallback className="bg-chart-3/20 text-chart-3">
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h4 className="font-medium text-foreground">{user.name}</h4>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                <p className="text-sm text-muted-foreground">{company?.name}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="default"
                                  className="bg-chart-4 hover:bg-chart-4/90"
                                  onClick={() => handleApproveUser(user.id)}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Aprobar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleRejectUser(user.id)}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Rechazar
                                </Button>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold mb-4 text-foreground">
                    Todos los Usuarios ({filteredUsers.length})
                  </h3>
                  <div className="grid gap-4">
                    {filteredUsers.map(user => {
                      const company = mockCompanies.find(c => c.id === user.companyId);
                      return (
                        <Card key={user.id} className="p-4 bg-card border-border">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-primary/20 text-primary">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-foreground">{user.name}</h4>
                                <Badge
                                  variant="outline"
                                  className={
                                    user.status === 'APPROVED' 
                                      ? 'bg-chart-4/20 text-chart-4 border-chart-4/30'
                                      : user.status === 'PENDING'
                                      ? 'bg-chart-3/20 text-chart-3 border-chart-3/30'
                                      : 'bg-destructive/20 text-destructive border-destructive/30'
                                  }
                                >
                                  {user.status}
                                </Badge>
                                {user.role === 'SUPERADMIN' && (
                                  <Badge variant="outline" className="bg-chart-2/20 text-chart-2 border-chart-2/30">
                                    ADMIN
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{user.email} · {user.phone}</p>
                              <p className="text-sm text-muted-foreground">{company?.name}</p>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Companies View */}
        {activeView === 'companies' && (() => {
          // Filter companies by search query
          const filteredCompanies = mockCompanies.filter(company => 
            company.name.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
            company.email.toLowerCase().includes(clientSearchQuery.toLowerCase())
          );
          
          return (
            <div className="h-full overflow-auto p-6">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Clientes</h2>
                  <div className="w-96">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar cliente por nombre o email..."
                        value={clientSearchQuery}
                        onChange={(e) => setClientSearchQuery(e.target.value)}
                        className="pl-10 bg-card border-border text-foreground"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid gap-4">
                  {filteredCompanies.map(company => {
                    const companyUsers = users.filter(u => u.companyId === company.id);
                    const companyTickets = mockTickets.filter(t => t.companyId === company.id);
                    const companyProjects = mockProjects.filter(p => p.companyId === company.id);
                    
                    return (
                      <Card key={company.id} className="p-6 bg-card border-border">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-foreground">{company.name}</h3>
                            <p className="text-muted-foreground">{company.email}</p>
                            <p className="text-muted-foreground">{company.phone}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge className="bg-primary/20 text-primary border-primary/30">
                              {companyUsers.length} usuarios
                            </Badge>
                            <Badge className="bg-chart-3/20 text-chart-3 border-chart-3/30">
                              {companyTickets.length} tickets
                            </Badge>
                            <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/30">
                              {companyProjects.length} proyectos
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="border-t border-border pt-4 mb-4">
                          <h4 className="font-medium mb-2 text-foreground">Usuarios:</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {companyUsers.map(user => (
                              <div key={user.id} className="text-sm flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                                    {user.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-foreground">{user.name}</span>
                                {user.status !== 'APPROVED' && (
                                  <Badge variant="outline" className="text-xs bg-chart-3/20 text-chart-3 border-chart-3/30">
                                    {user.status}
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1 border-border hover:bg-secondary"
                            onClick={() => {
                              setSelectedCompanyForDetails(company.id);
                              setDetailsView('tickets');
                            }}
                          >
                            <Ticket className="h-4 w-4 mr-2" />
                            Ver Tickets
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1 border-border hover:bg-secondary"
                            onClick={() => {
                              setSelectedCompanyForDetails(company.id);
                              setDetailsView('projects');
                            }}
                          >
                            <FolderKanban className="h-4 w-4 mr-2" />
                            Ver Proyectos
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Dashboard View */}
        {activeView === 'dashboard' && (
          <DashboardView />
        )}
      </div>
      
      {/* Tickets Modal */}
      <Dialog open={detailsView === 'tickets'} onOpenChange={(open) => {
        if (!open) {
          setDetailsView(null);
          setTicketSearchQuery('');
          setTicketUserFilter('all');
        }
      }}>
        <DialogContent className="max-w-4xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Tickets - {mockCompanies.find(c => c.id === selectedCompanyForDetails)?.name}
            </DialogTitle>
          </DialogHeader>
          {/* Filters */}
          <div className="flex gap-3 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar ticket por título o descripción..."
                value={ticketSearchQuery}
                onChange={(e) => setTicketSearchQuery(e.target.value)}
                className="pl-10 bg-background border-border text-foreground h-9"
              />
            </div>
            <Select value={ticketUserFilter} onValueChange={setTicketUserFilter}>
              <SelectTrigger className="w-56 bg-background border-border text-foreground h-9">
                <SelectValue placeholder="Filtrar por usuario" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all" className="text-foreground">Todos los usuarios</SelectItem>
                {selectedCompanyForDetails && users
                  .filter(u => u.companyId === selectedCompanyForDetails)
                  .map(user => (
                    <SelectItem key={user.id} value={user.id} className="text-foreground">
                      {user.name}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
          <ScrollArea className="max-h-[500px]">
            <div className="space-y-3">
              {mockTickets
                .filter(t => t.companyId === selectedCompanyForDetails)
                .filter(t => {
                  // Filter by search query
                  const matchesSearch = ticketSearchQuery === '' || 
                    t.title.toLowerCase().includes(ticketSearchQuery.toLowerCase()) ||
                    t.description.toLowerCase().includes(ticketSearchQuery.toLowerCase()) ||
                    t.id.toLowerCase().includes(ticketSearchQuery.toLowerCase()); 
                  
                  // Filter by user
                  const matchesUser = ticketUserFilter === 'all' || t.createdBy === ticketUserFilter;
                  
                  return matchesSearch && matchesUser;
                })
                .map(ticket => (
                  <Card key={ticket.id} className="p-4 bg-muted border-border">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                            {ticket.id}
                          </Badge>
                          <Badge 
                            variant="outline"
                            className={
                              ticket.type === 'INCIDENT'
                                ? 'bg-[#d30a16]/20 text-[#d30a16] border-[#d30a16]/30'
                                : 'bg-[#029766]/20 text-[#029766] border-[#029766]/30'
                            }
                          >
                            {ticket.type}
                          </Badge>
                          <Badge 
                            variant="outline"
                            className={
                              ticket.status === 'OPEN'
                                ? 'bg-[#f28737]/20 text-[#f28737] border-[#f28737]/30'
                                : ticket.status === 'IN_PROGRESS'
                                ? 'bg-[#24b1df]/20 text-[#24b1df] border-[#24b1df]/30'
                                : ticket.status === 'RESOLVED'
                                ? 'bg-chart-4/20 text-chart-4 border-chart-4/30'
                                : 'bg-muted text-muted-foreground border-border'
                            }
                          >
                            {ticket.status}
                          </Badge>
                          <Badge 
                            variant="outline"
                            className={
                              ticket.priority === 'URGENT'
                                ? 'bg-[#d30a16]/20 text-[#d30a16] border-[#d30a16]/30'
                                : ticket.priority === 'HIGH'
                                ? 'bg-[#ea4090]/20 text-[#ea4090] border-[#ea4090]/30'
                                : ticket.priority === 'MEDIUM'
                                ? 'bg-[#822ca3]/20 text-[#822ca3] border-[#822ca3]/30'
                                : 'bg-muted text-muted-foreground border-border'
                            }
                          >
                            {ticket.priority}
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-foreground">{ticket.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{ticket.description}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Creado por {ticket.createdByName} el {new Date(ticket.createdAt).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="text-primary hover:bg-primary/20"
                        onClick={() => window.open(`#/ticket/${ticket.id}`, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      
      {/* Projects Modal */}
      <Dialog open={detailsView === 'projects'} onOpenChange={(open) => {
        if (!open) {
          setDetailsView(null);
          setProjectSearchQuery('');
        }
      }}>
        <DialogContent className="max-w-3xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Proyectos - {mockCompanies.find(c => c.id === selectedCompanyForDetails)?.name}
            </DialogTitle>
          </DialogHeader>
          {/* Search Filter */}
          <div className="mb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar proyecto por nombre o descripción..."
                value={projectSearchQuery}
                onChange={(e) => setProjectSearchQuery(e.target.value)}
                className="pl-10 bg-background border-border text-foreground h-9"
              />
            </div>
          </div>
          <ScrollArea className="max-h-[500px]">
            <div className="space-y-3">
              {mockProjects
                .filter(p => p.companyId === selectedCompanyForDetails)
                .filter(p => {
                  return projectSearchQuery === '' ||
                    p.name.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
                    p.description.toLowerCase().includes(projectSearchQuery.toLowerCase());
                })
                .map(project => (
                  <Card key={project.id} className="p-4 bg-muted border-border">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-foreground">{project.name}</h4>
                          <Badge 
                            variant="outline"
                            className={
                              project.status === 'ACTIVE'
                                ? 'bg-chart-4/20 text-chart-4 border-chart-4/30'
                                : project.status === 'COMPLETED'
                                ? 'bg-muted text-muted-foreground border-border'
                                : 'bg-chart-3/20 text-chart-3 border-chart-3/30'
                            }
                          >
                            {project.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-primary text-primary hover:bg-primary/20"
                          onClick={() => window.open(project.scheduleUrl, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Ver Cronograma
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};
