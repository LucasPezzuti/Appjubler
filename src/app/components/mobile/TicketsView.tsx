import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockTickets, mockTicketComments } from '../../mock-data';
import { Ticket, TicketStatus, TicketType } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { GalaxyBackground } from '../GalaxyBackground';
import { TicketDetailView } from './TicketDetailView';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Badge } from '../ui/badge';
import { Plus, Filter, AlertCircle, CheckCircle2, Clock, XCircle, Image as ImageIcon, Video, X as XIcon } from 'lucide-react';
import { toast } from 'sonner';

export const TicketsView: React.FC = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    // Adjuntar comentarios a los tickets
    return mockTickets
      .filter(t => t.companyId === user?.companyId)
      .map(ticket => {
        const comments = mockTicketComments.filter(c => c.ticketId === ticket.id);
        const hasActionRequired = comments.some(c => 
          (c.commentType === 'MASDACLI' && c.requiresResponse) ||
          (c.commentType === 'COMUNICLI' && c.requiresApproval)
        );
        const hasUnreadComments = comments.some(c => !c.read && c.userRole === 'SUPERADMIN');
        
        return {
          ...ticket,
          comments,
          hasUnreadComments,
          hasActionRequired
        };
      });
  });
  const [filterStatus, setFilterStatus] = useState<TicketStatus | 'ALL'>('ALL');
  const [filterUser, setFilterUser] = useState<string>('ALL');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  
  // New ticket form
  const [newTicket, setNewTicket] = useState({
    type: 'INCIDENT' as TicketType,
    title: '',
    description: '',
    priority: 'MEDIUM'
  });

  const filteredTickets = tickets.filter(t => {
    if (filterStatus !== 'ALL' && t.status !== filterStatus) return false;
    if (filterUser !== 'ALL' && t.createdBy !== filterUser) return false;
    return true;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter(file => {
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        return isImage || isVideo;
      });
      
      if (validFiles.length !== files.length) {
        toast.error('Solo se permiten archivos de imagen y video');
      }
      
      setAttachedFiles([...attachedFiles, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };

  const handleCreateTicket = () => {
    if (!user) return;

    const ticket: Ticket = {
      id: `T-${(tickets.length + 1).toString().padStart(3, '0')}`,
      type: newTicket.type,
      title: newTicket.title,
      description: newTicket.description,
      status: 'OPEN',
      priority: newTicket.priority as any,
      urgency: newTicket.priority as any,
      impact: 'MEDIUM',
      origin: 'MOBILE',
      companyId: user.companyId,
      companyName: user.name,
      createdBy: user.id,
      createdByName: user.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
      hasUnreadComments: false
    };

    setTickets([ticket, ...tickets]);
    setIsCreateOpen(false);
    setNewTicket({
      type: 'INCIDENT',
      title: '',
      description: '',
      priority: 'MEDIUM'
    });
    setAttachedFiles([]);
    toast.success(`Ticket creado exitosamente${attachedFiles.length > 0 ? ` con ${attachedFiles.length} archivo(s) adjunto(s)` : ''}`);
  };

  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case 'OPEN': return <AlertCircle className="h-4 w-4" />;
      case 'IN_PROGRESS': return <Clock className="h-4 w-4" />;
      case 'RESOLVED': return <CheckCircle2 className="h-4 w-4" />;
      case 'CLOSED': return <XCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-gray-100 text-gray-800';
      case 'MEDIUM': return 'bg-blue-100 text-blue-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'URGENT': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: TicketType) => {
    return type === 'INCIDENT' 
      ? 'bg-red-100 text-red-800' 
      : 'bg-purple-100 text-purple-800';
  };

  // Si hay un ticket seleccionado, mostrar la vista de detalles
  if (selectedTicket) {
    return (
      <TicketDetailView
        ticket={selectedTicket}
        onBack={() => setSelectedTicket(null)}
        onUpdate={(updatedTicket) => {
          setTickets(tickets.map(t => t.id === updatedTicket.id ? updatedTicket : t));
          setSelectedTicket(updatedTicket);
        }}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-background relative">
      {/* Galaxy Background */}
      <GalaxyBackground />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border bg-card/80 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Tickets</h2>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Ticket
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Crear Nuevo Ticket</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Completa los datos para crear un nuevo ticket
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">Tipo</Label>
                    <Select
                      value={newTicket.type}
                      onValueChange={(value) => setNewTicket({ ...newTicket, type: value as TicketType })}
                    >
                      <SelectTrigger className="bg-background border-border text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="INCIDENT" className="text-foreground">Incidente</SelectItem>
                        <SelectItem value="REQUIREMENT" className="text-foreground">Requerimiento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Título</Label>
                    <Input
                      placeholder="Título del ticket"
                      value={newTicket.title}
                      onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                      className="bg-background border-border text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Descripción</Label>
                    <Textarea
                      placeholder="Describe el problema o requerimiento"
                      rows={4}
                      value={newTicket.description}
                      onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                      className="bg-background border-border text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Prioridad</Label>
                    <Select
                      value={newTicket.priority}
                      onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}
                    >
                      <SelectTrigger className="bg-background border-border text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="LOW" className="text-foreground">Baja</SelectItem>
                        <SelectItem value="MEDIUM" className="text-foreground">Media</SelectItem>
                        <SelectItem value="HIGH" className="text-foreground">Alta</SelectItem>
                        <SelectItem value="URGENT" className="text-foreground">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Archivos Adjuntos (Fotos/Videos)</Label>
                    <Input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="bg-background border-border text-foreground"
                    />
                    {attachedFiles.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {attachedFiles.map((file, index) => (
                          <div key={index} className="flex items-center bg-muted px-2 py-1 rounded text-foreground text-sm">
                            {file.type.startsWith('image/') ? <ImageIcon className="h-4 w-4 mr-1" /> : <Video className="h-4 w-4 mr-1" />}
                            <span className="max-w-[150px] truncate">{file.name}</span>
                            <button onClick={() => removeFile(index)} className="ml-2">
                              <XIcon className="h-4 w-4 text-destructive hover:text-destructive/80" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button onClick={handleCreateTicket} className="w-full bg-primary hover:bg-primary/90">
                    Crear Ticket
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger className="w-full bg-background border-border text-foreground">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="ALL" className="text-foreground">Todos los estados</SelectItem>
                <SelectItem value="OPEN" className="text-foreground">Abierto</SelectItem>
                <SelectItem value="IN_PROGRESS" className="text-foreground">En Progreso</SelectItem>
                <SelectItem value="RESOLVED" className="text-foreground">Resuelto</SelectItem>
                <SelectItem value="CLOSED" className="text-foreground">Cerrado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterUser} onValueChange={setFilterUser}>
              <SelectTrigger className="w-full bg-background border-border text-foreground">
                <SelectValue placeholder="Usuario" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="ALL" className="text-foreground">Todos</SelectItem>
                {[...new Set(tickets.map(t => t.createdBy))].map(userId => {
                  const ticket = tickets.find(t => t.createdBy === userId);
                  return (
                    <SelectItem key={userId} value={userId} className="text-foreground">
                      {ticket?.createdByName}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tickets List */}
        <div className="flex-1 overflow-auto p-4 space-y-3">
          {filteredTickets.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No hay tickets para mostrar</p>
            </div>
          ) : (
            filteredTickets.map(ticket => (
              <Card 
                key={ticket.id} 
                className="hover:shadow-md transition-shadow bg-card border-border cursor-pointer"
                onClick={() => setSelectedTicket(ticket)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge variant="outline" className={
                          ticket.type === 'INCIDENT' 
                            ? 'bg-chart-6/20 text-chart-6 border-chart-6/30'
                            : 'bg-chart-5/20 text-chart-5 border-chart-5/30'
                        }>
                          {ticket.type === 'INCIDENT' ? 'Incidente' : 'Requerimiento'}
                        </Badge>
                        <Badge variant="outline" className={
                          ticket.priority === 'LOW' ? 'bg-muted text-muted-foreground border-border' :
                          ticket.priority === 'MEDIUM' ? 'bg-chart-1/20 text-chart-1 border-chart-1/30' :
                          ticket.priority === 'HIGH' ? 'bg-chart-2/20 text-chart-2 border-chart-2/30' :
                          'bg-destructive/20 text-destructive border-destructive/30'
                        }>
                          {ticket.priority}
                        </Badge>
                        {ticket.hasActionRequired && (
                          <Badge className="bg-[#f28737] text-white border-[#f28737] hover:bg-[#f28737]/90 animate-pulse">
                            ACCIÓN REQUERIDA
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-base text-foreground">{ticket.title}</CardTitle>
                    </div>
                    <Badge className={
                      ticket.status === 'OPEN' ? 'bg-chart-1/20 text-chart-1 border-chart-1/30' :
                      ticket.status === 'IN_PROGRESS' ? 'bg-chart-3/20 text-chart-3 border-chart-3/30' :
                      ticket.status === 'RESOLVED' ? 'bg-chart-4/20 text-chart-4 border-chart-4/30' :
                      'bg-muted text-muted-foreground border-border'
                    } variant="outline">
                      {getStatusIcon(ticket.status)}
                      <span className="ml-1">
                        {ticket.status === 'OPEN' && 'Abierto'}
                        {ticket.status === 'IN_PROGRESS' && 'En Progreso'}
                        {ticket.status === 'RESOLVED' && 'Resuelto'}
                        {ticket.status === 'CLOSED' && 'Cerrado'}
                      </span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{ticket.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>#{ticket.id} · {ticket.createdByName}</span>
                    <span>{new Date(ticket.createdAt).toLocaleDateString('es-ES')}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};