import React, { useState } from 'react';
import { mockTickets, mockTicketComments, mockUsers, mockCompanies } from '../../mock-data';
import { Ticket, TicketComment } from '../../types';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AlertCircle, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const AdminTicketsView: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    // Agregar comentarios y flag de no leídos
    return mockTickets.map(ticket => {
      const comments = mockTicketComments.filter(c => c.ticketId === ticket.id);
      const hasUnreadComments = comments.some(
        c => !c.read && c.userRole === 'CLIENT'
      );
      const hasActionRequired = comments.some(c => 
        (c.commentType === 'MASDACLI' && c.requiresResponse) ||
        (c.commentType === 'COMUNICLI' && c.requiresApproval)
      );
      
      return {
        ...ticket,
        comments,
        hasUnreadComments,
        hasActionRequired
      };
    });
  });
  
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [ticketCompanyFilter, setTicketCompanyFilter] = useState<string>('all');
  const [ticketUserFilterState, setTicketUserFilterState] = useState<string>('all');
  const [ticketGroupBy, setTicketGroupBy] = useState<'none' | 'company' | 'user'>('none');
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<TicketComment[]>(mockTicketComments);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN': return <AlertCircle className="h-4 w-4" />;
      case 'IN_PROGRESS': return <Clock className="h-4 w-4" />;
      case 'RESOLVED': return <CheckCircle2 className="h-4 w-4" />;
      case 'CLOSED': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedTicket) return;

    const comment: TicketComment = {
      id: `${selectedTicket.id}-comment-${Date.now()}`,
      ticketId: selectedTicket.id,
      userId: 'admin1',
      userName: 'Admin Jubbler',
      userRole: 'SUPERADMIN',
      content: newComment,
      timestamp: new Date().toISOString(),
      read: true
    };

    setComments([...comments, comment]);
    
    // Update the selected ticket's comments
    const updatedTickets = tickets.map(t => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          comments: [...(t.comments || []), comment]
        };
      }
      return t;
    });
    
    setTickets(updatedTickets);
    setSelectedTicket({
      ...selectedTicket,
      comments: [...(selectedTicket.comments || []), comment]
    });
    
    setNewComment('');
    toast.success('Comentario agregado');
  };

  // Apply filters
  const filteredTickets = tickets.filter(t => {
    if (ticketCompanyFilter !== 'all' && t.companyId !== ticketCompanyFilter) return false;
    if (ticketUserFilterState !== 'all' && t.createdBy !== ticketUserFilterState) return false;
    return true;
  });

  // Sort: Tickets with unread comments first
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    if (a.hasUnreadComments && !b.hasUnreadComments) return -1;
    if (!a.hasUnreadComments && b.hasUnreadComments) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Group tickets
  const groupedTickets: Record<string, Ticket[]> = {};
  if (ticketGroupBy === 'company') {
    sortedTickets.forEach(ticket => {
      const key = ticket.companyName || ticket.companyId;
      if (!groupedTickets[key]) groupedTickets[key] = [];
      groupedTickets[key].push(ticket);
    });
  } else if (ticketGroupBy === 'user') {
    sortedTickets.forEach(ticket => {
      const key = ticket.createdByName;
      if (!groupedTickets[key]) groupedTickets[key] = [];
      groupedTickets[key].push(ticket);
    });
  } else {
    groupedTickets['all'] = sortedTickets;
  }

  const ticketComments = selectedTicket 
    ? comments.filter(c => c.ticketId === selectedTicket.id)
    : [];

  return (
    <div className="h-full flex">
      {/* Tickets List - 25% */}
      <div className="w-1/4 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground mb-3">Tickets</h3>
          
          {/* Company Filter */}
          <Select value={ticketCompanyFilter} onValueChange={setTicketCompanyFilter}>
            <SelectTrigger className="bg-background border-border text-foreground h-9 mb-2">
              <SelectValue placeholder="Filtrar por empresa" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all" className="text-foreground">
                Todas las empresas
              </SelectItem>
              {mockCompanies.map(company => (
                <SelectItem key={company.id} value={company.id} className="text-foreground">
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* User Filter */}
          <Select value={ticketUserFilterState} onValueChange={setTicketUserFilterState}>
            <SelectTrigger className="bg-background border-border text-foreground h-9 mb-2">
              <SelectValue placeholder="Filtrar por usuario" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all" className="text-foreground">
                Todos los usuarios
              </SelectItem>
              {mockUsers.filter(u => u.role !== 'SUPERADMIN').map(user => (
                <SelectItem key={user.id} value={user.id} className="text-foreground">
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Group By */}
          <Select value={ticketGroupBy} onValueChange={(v) => setTicketGroupBy(v as any)}>
            <SelectTrigger className="bg-background border-border text-foreground h-9">
              <SelectValue placeholder="Agrupar por" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="none" className="text-foreground">Sin agrupar</SelectItem>
              <SelectItem value="company" className="text-foreground">Por empresa</SelectItem>
              <SelectItem value="user" className="text-foreground">Por usuario</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {Object.entries(groupedTickets).map(([groupKey, groupTickets]) => (
              <div key={groupKey}>
                {ticketGroupBy !== 'none' && (
                  <div className="px-2 py-2 text-xs font-semibold text-muted-foreground uppercase">
                    {groupKey}
                  </div>
                )}
                {groupTickets.map(ticket => (
                  <Card
                    key={ticket.id}
                    className={`p-3 cursor-pointer hover:bg-secondary transition-colors border-border relative ${
                      selectedTicket?.id === ticket.id ? 'border-l-4 border-primary bg-secondary' : ''
                    } ${
                      ticket.hasUnreadComments ? 'border-l-4 border-destructive' : ''
                    }`}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    {ticket.hasUnreadComments && (
                      <div className="absolute top-2 right-2">
                        <div className="h-2 w-2 bg-destructive rounded-full animate-pulse" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs bg-primary/20 text-primary border-primary/30">
                          {ticket.id}
                        </Badge>
                        <Badge 
                          variant="outline"
                          className={
                            ticket.priority === 'URGENT'
                              ? 'text-xs bg-destructive/20 text-destructive border-destructive/30'
                              : ticket.priority === 'HIGH'
                              ? 'text-xs bg-[#ea4090]/20 text-[#ea4090] border-[#ea4090]/30'
                              : ticket.priority === 'MEDIUM'
                              ? 'text-xs bg-[#822ca3]/20 text-[#822ca3] border-[#822ca3]/30'
                              : 'text-xs bg-muted text-muted-foreground border-border'
                          }
                        >
                          {ticket.priority}
                        </Badge>
                      </div>
                      <p className="font-medium text-sm text-foreground truncate">{ticket.title}</p>
                      <p className="text-xs text-muted-foreground truncate mt-1">{ticket.createdByName}</p>
                      {ticketGroupBy === 'none' && (
                        <p className="text-xs text-muted-foreground truncate">{ticket.companyName}</p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Ticket Details - 50% */}
      <div className="flex-1 flex flex-col bg-card">
        {selectedTicket ? (
          <>
            <div className="p-4 border-b border-border">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                      {selectedTicket.id}
                    </Badge>
                    <Badge 
                      variant="outline"
                      className={
                        selectedTicket.type === 'INCIDENT'
                          ? 'bg-[#d30a16]/20 text-[#d30a16] border-[#d30a16]/30'
                          : 'bg-[#029766]/20 text-[#029766] border-[#029766]/30'
                      }
                    >
                      {selectedTicket.type === 'INCIDENT' ? 'Incidente' : 'Requerimiento'}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{selectedTicket.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{selectedTicket.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Creado por: {selectedTicket.createdByName}</span>
                    <span>•</span>
                    <span>{selectedTicket.companyName}</span>
                    <span>•</span>
                    <span>{format(new Date(selectedTicket.createdAt), "d/M/yyyy", { locale: es })}</span>
                  </div>
                </div>
                <Badge 
                  variant="outline"
                  className={
                    selectedTicket.status === 'OPEN'
                      ? 'bg-[#f28737]/20 text-[#f28737] border-[#f28737]/30'
                      : selectedTicket.status === 'IN_PROGRESS'
                      ? 'bg-[#24b1df]/20 text-[#24b1df] border-[#24b1df]/30'
                      : selectedTicket.status === 'RESOLVED'
                      ? 'bg-chart-4/20 text-chart-4 border-chart-4/30'
                      : 'bg-muted text-muted-foreground border-border'
                  }
                >
                  {getStatusIcon(selectedTicket.status)}
                  <span className="ml-1">
                    {selectedTicket.status === 'OPEN' && 'Abierto'}
                    {selectedTicket.status === 'IN_PROGRESS' && 'En Progreso'}
                    {selectedTicket.status === 'RESOLVED' && 'Resuelto'}
                    {selectedTicket.status === 'CLOSED' && 'Cerrado'}
                  </span>
                </Badge>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <Card className="p-2 bg-muted border-border">
                  <p className="text-xs text-muted-foreground mb-1">Prioridad</p>
                  <Badge 
                    variant="outline"
                    className={
                      selectedTicket.priority === 'URGENT'
                        ? 'bg-destructive/20 text-destructive border-destructive/30'
                        : selectedTicket.priority === 'HIGH'
                        ? 'bg-[#ea4090]/20 text-[#ea4090] border-[#ea4090]/30'
                        : selectedTicket.priority === 'MEDIUM'
                        ? 'bg-[#822ca3]/20 text-[#822ca3] border-[#822ca3]/30'
                        : 'bg-muted text-muted-foreground border-border'
                    }
                  >
                    {selectedTicket.priority}
                  </Badge>
                </Card>
                <Card className="p-2 bg-muted border-border">
                  <p className="text-xs text-muted-foreground mb-1">Urgencia</p>
                  <p className="text-sm font-medium text-foreground">{selectedTicket.urgency}</p>
                </Card>
                <Card className="p-2 bg-muted border-border">
                  <p className="text-xs text-muted-foreground mb-1">Impacto</p>
                  <p className="text-sm font-medium text-foreground">{selectedTicket.impact}</p>
                </Card>
              </div>
            </div>

            <div className="p-4 border-b border-border bg-muted">
              <h4 className="font-semibold text-foreground mb-3">Comentarios</h4>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {ticketComments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">No hay comentarios aún</p>
                  </div>
                ) : (
                  ticketComments.map((comment) => (
                    <Card key={comment.id} className={`p-4 ${
                      comment.userRole === 'SUPERADMIN' 
                        ? 'bg-primary/5 border-primary/20' 
                        : 'bg-card'
                    }`}>
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className={
                            comment.userRole === 'SUPERADMIN'
                              ? 'bg-primary text-primary-foreground text-xs'
                              : 'bg-secondary text-secondary-foreground text-xs'
                          }>
                            {comment.userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-foreground">
                              {comment.userName}
                            </span>
                            {comment.userRole === 'SUPERADMIN' && (
                              <Badge variant="outline" className="text-xs bg-primary/20 text-primary border-primary/30">
                                Admin
                              </Badge>
                            )}
                            {!comment.read && comment.userRole === 'CLIENT' && (
                              <Badge variant="outline" className="text-xs bg-destructive/20 text-destructive border-destructive/30">
                                Nuevo
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-foreground mb-2">{comment.content}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(comment.timestamp), "d/M/yyyy HH:mm", { locale: es })}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe tu respuesta..."
                className="mb-3 bg-background border-border text-foreground"
                rows={3}
              />
              <Button 
                onClick={handleAddComment} 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={!newComment.trim()}
              >
                Enviar Respuesta
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <AlertCircle className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p>Selecciona un ticket para ver los detalles</p>
            </div>
          </div>
        )}
      </div>

      {/* Client Info - 25% */}
      <div className="w-1/4 border-l border-border bg-muted p-4">
        {selectedTicket ? (
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Información del Ticket</h3>
            
            <div className="space-y-4">
              <Card className="p-3 bg-card border-border">
                <p className="text-xs text-muted-foreground mb-1">Empresa</p>
                <p className="text-sm font-medium text-foreground">{selectedTicket.companyName}</p>
              </Card>

              <Card className="p-3 bg-card border-border">
                <p className="text-xs text-muted-foreground mb-1">Usuario</p>
                <p className="text-sm font-medium text-foreground">{selectedTicket.createdByName}</p>
              </Card>

              <Card className="p-3 bg-card border-border">
                <p className="text-xs text-muted-foreground mb-1">Origen</p>
                <p className="text-sm font-medium text-foreground">{selectedTicket.origin}</p>
              </Card>

              <Card className="p-3 bg-card border-border">
                <p className="text-xs text-muted-foreground mb-1">Creado</p>
                <p className="text-sm font-medium text-foreground">
                  {format(new Date(selectedTicket.createdAt), "d 'de' MMMM, yyyy", { locale: es })}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(selectedTicket.createdAt), "HH:mm", { locale: es })}
                </p>
              </Card>

              <Card className="p-3 bg-card border-border">
                <p className="text-xs text-muted-foreground mb-1">Última actualización</p>
                <p className="text-sm font-medium text-foreground">
                  {format(new Date(selectedTicket.updatedAt), "d 'de' MMMM, yyyy", { locale: es })}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(selectedTicket.updatedAt), "HH:mm", { locale: es })}
                </p>
              </Card>

              <Card className="p-3 bg-card border-border">
                <p className="text-xs text-muted-foreground mb-1">Comentarios</p>
                <p className="text-sm font-medium text-foreground">
                  {ticketComments.length} comentario{ticketComments.length !== 1 ? 's' : ''}
                </p>
                {ticketComments.filter(c => !c.read && c.userRole === 'CLIENT').length > 0 && (
                  <Badge variant="outline" className="mt-2 bg-destructive/20 text-destructive border-destructive/30">
                    {ticketComments.filter(c => !c.read && c.userRole === 'CLIENT').length} sin leer
                  </Badge>
                )}
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            <p className="text-sm">No hay ticket seleccionado</p>
          </div>
        )}
      </div>
    </div>
  );
};