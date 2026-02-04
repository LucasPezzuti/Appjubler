import React, { useState, useEffect, useRef } from 'react';
import { Ticket, TicketComment } from '../../types';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

interface TicketDetailViewProps {
  ticket: Ticket;
  onBack: () => void;
  onUpdate?: (ticket: Ticket) => void;
}

export const TicketDetailView: React.FC<TicketDetailViewProps> = ({ ticket, onBack, onUpdate }) => {
  const { user } = useAuth();
  const [showCommentsDialog, setShowCommentsDialog] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<TicketComment[]>(ticket.comments || []);
  const [respondingToCommentId, setRespondingToCommentId] = useState<string | null>(null);
  const [approvingCommentId, setApprovingCommentId] = useState<string | null>(null);
  const bitacoraRef = useRef<HTMLDivElement>(null);

  // Auto-scroll a bitácora si hay acción requerida
  useEffect(() => {
    if (ticket.hasActionRequired && bitacoraRef.current) {
      setTimeout(() => {
        bitacoraRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [ticket.hasActionRequired]);

  const getPriorityConfig = (priority: string) => {
    const config = {
      LOW: { label: 'BAJA', color: 'bg-blue-500' },
      MEDIUM: { label: 'MEDIA', color: 'bg-yellow-500' },
      HIGH: { label: 'ALTA', color: 'bg-red-500' },
      URGENT: { label: 'URGENTE', color: 'bg-red-600' }
    };
    return config[priority as keyof typeof config] || config.MEDIUM;
  };

  const getUrgencyLabel = (urgency: string) => {
    const labels = {
      LOW: 'BAJA',
      MEDIUM: 'MEDIA',
      HIGH: 'ALTA'
    };
    return labels[urgency as keyof typeof labels] || urgency;
  };

  const getImpactLabel = (impact: string) => {
    const labels = {
      LOW: 'BAJO',
      MEDIUM: 'MEDIO',
      HIGH: 'ALTO'
    };
    return labels[impact as keyof typeof labels] || impact;
  };

  const getOriginLabel = (origin: string) => {
    const labels = {
      WEB: 'WEB',
      EMAIL: 'EMAIL',
      PHONE: 'TELÉFONO',
      MOBILE: 'MÓVIL'
    };
    return labels[origin as keyof typeof labels] || origin;
  };

  const handleRespond = (commentId: string) => {
    setRespondingToCommentId(commentId);
    setShowCommentsDialog(true);
  };

  const handleApprove = (commentId: string) => {
    if (!user) return;

    // Crear comentario APROBACLI indicando aprobación
    const approvalComment: TicketComment = {
      id: `${ticket.id}-approval-${Date.now()}`,
      ticketId: ticket.id,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      content: 'Desarrollo aprobado',
      timestamp: new Date().toISOString(),
      read: true,
      commentType: 'APROBACLI',
      approvedCommentId: commentId,
      approved: true
    };

    const updatedComments = [...comments, approvalComment];
    
    // Marcar el comentario COMUNICLI como procesado
    const commentIndex = updatedComments.findIndex(c => c.id === commentId);
    if (commentIndex !== -1) {
      updatedComments[commentIndex] = {
        ...updatedComments[commentIndex],
        requiresApproval: false
      };
    }

    setComments(updatedComments);
    
    // Actualizar el ticket - cambiar estado a RESOLVED y quitar acción requerida
    const hasActionRequired = updatedComments.some(c => 
      (c.commentType === 'MASDACLI' && c.requiresResponse) ||
      (c.commentType === 'COMUNICLI' && c.requiresApproval)
    );
    
    const updatedTicket = {
      ...ticket,
      status: 'RESOLVED' as const,
      comments: updatedComments,
      hasActionRequired
    };
    
    if (onUpdate) {
      onUpdate(updatedTicket);
    }

    toast.success('Desarrollo aprobado. Ticket resuelto.');
  };

  const handleReject = (commentId: string) => {
    setApprovingCommentId(commentId);
    setShowCommentsDialog(true);
  };

  const handleAddCommentWithApproval = (commentType: 'NORMAL' | 'RTAMASDACL' | 'APROBACLI' = 'NORMAL', relatedId?: string, approved?: boolean) => {
    if (!newComment.trim() || !user) return;

    const comment: TicketComment = {
      id: `${ticket.id}-comment-${Date.now()}`,
      ticketId: ticket.id,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      content: newComment,
      timestamp: new Date().toISOString(),
      read: true,
      commentType,
      ...(commentType === 'RTAMASDACL' && { respondedToCommentId: relatedId }),
      ...(commentType === 'APROBACLI' && { approvedCommentId: relatedId, approved })
    };

    const updatedComments = [...comments, comment];
    
    // Si es una respuesta a MASDACLI, marcar el comentario original como respondido
    if (commentType === 'RTAMASDACL' && relatedId) {
      const commentIndex = updatedComments.findIndex(c => c.id === relatedId);
      if (commentIndex !== -1) {
        updatedComments[commentIndex] = {
          ...updatedComments[commentIndex],
          requiresResponse: false
        };
      }
    }

    // Si es un rechazo de COMUNICLI, marcar el comentario original como procesado
    if (commentType === 'APROBACLI' && relatedId && approved === false) {
      const commentIndex = updatedComments.findIndex(c => c.id === relatedId);
      if (commentIndex !== -1) {
        updatedComments[commentIndex] = {
          ...updatedComments[commentIndex],
          requiresApproval: false
        };
      }
    }

    setComments(updatedComments);
    
    // Actualizar el ticket
    const hasActionRequired = updatedComments.some(c => 
      (c.commentType === 'MASDACLI' && c.requiresResponse) ||
      (c.commentType === 'COMUNICLI' && c.requiresApproval)
    );
    
    const updatedTicket = {
      ...ticket,
      comments: updatedComments,
      hasActionRequired
    };
    
    if (onUpdate) {
      onUpdate(updatedTicket);
    }

    setNewComment('');
    setRespondingToCommentId(null);
    setApprovingCommentId(null);
    setShowCommentsDialog(false);
    toast.success(commentType === 'APROBACLI' ? 'Rechazo enviado exitosamente' : 'Comentario agregado exitosamente');
  };

  const priorityConfig = getPriorityConfig(ticket.priority);

  // Ordenar comentarios: primero acción requerida (MASDACLI y COMUNICLI sin responder), luego por fecha
  const sortedComments = [...comments].sort((a, b) => {
    const aRequiresAction = (a.commentType === 'MASDACLI' && a.requiresResponse) || (a.commentType === 'COMUNICLI' && a.requiresApproval);
    const bRequiresAction = (b.commentType === 'MASDACLI' && b.requiresResponse) || (b.commentType === 'COMUNICLI' && b.requiresApproval);
    
    // Si 'a' requiere acción y 'b' no, 'a' va primero
    if (aRequiresAction && !bRequiresAction) {
      return -1;
    }
    // Si 'b' requiere acción y 'a' no, 'b' va primero
    if (bRequiresAction && !aRequiresAction) {
      return 1;
    }
    // Si ambos o ninguno requieren acción, ordenar por fecha
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  });

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-primary px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-primary-foreground/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-white">Detalle del Ticket</h1>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Ticket ID and Title */}
          <Card className="bg-card/50 border-border">
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="inline-block px-3 py-1 rounded bg-primary/20 border border-primary/30 mb-2">
                    <span className="text-sm font-semibold text-primary">{ticket.id}</span>
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-1">{ticket.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {ticket.type === 'INCIDENT' ? 'Incidente' : 'Requerimiento'}
                  </p>
                </div>
                {ticket.hasActionRequired && (
                  <Badge className="bg-[#f28737] text-white hover:bg-[#f28737]/90 animate-pulse">
                    ACCIÓN REQUERIDA
                  </Badge>
                )}
              </div>
            </div>
          </Card>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Descripción</h3>
            <Card className="bg-card/30 border-border">
              <div className="p-4">
                <p className="text-sm text-foreground">{ticket.description}</p>
              </div>
            </Card>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-4 gap-2">
            {/* Prioridad */}
            <Card className="bg-card/30 border-border">
              <div className="p-3 flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full ${priorityConfig.color} mb-2`} />
                <p className="text-xs font-semibold text-foreground mb-1">Prioridad</p>
                <p className="text-xs text-muted-foreground">{priorityConfig.label}</p>
              </div>
            </Card>

            {/* Urgencia */}
            <Card className="bg-card/30 border-border">
              <div className="p-3 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gray-500 mb-2" />
                <p className="text-xs font-semibold text-foreground mb-1">Urgencia</p>
                <p className="text-xs text-muted-foreground">{getUrgencyLabel(ticket.urgency)}</p>
              </div>
            </Card>

            {/* Impacto */}
            <Card className="bg-card/30 border-border">
              <div className="p-3 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-blue-500 mb-2 flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded" />
                </div>
                <p className="text-xs font-semibold text-foreground mb-1">Impacto</p>
                <p className="text-xs text-muted-foreground">{getImpactLabel(ticket.impact)}</p>
              </div>
            </Card>

            {/* Origen */}
            <Card className="bg-card/30 border-border">
              <div className="p-3 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gray-600 mb-2" />
                <p className="text-xs font-semibold text-foreground mb-1">Origen</p>
                <p className="text-xs text-muted-foreground">{getOriginLabel(ticket.origin)}</p>
              </div>
            </Card>
          </div>

          {/* Bitácora Pública Section */}
          <div ref={bitacoraRef}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-primary" />
                Bitácora Pública
              </h3>
              <Button
                variant="default"
                size="sm"
                className="bg-primary hover:bg-primary/90"
                onClick={() => {
                  setRespondingToCommentId(null);
                  setShowCommentsDialog(true);
                }}
              >
                Nuevo Comentario
              </Button>
            </div>

            <div className="space-y-3">
              {sortedComments.length === 0 ? (
                <Card className="bg-card/30 border-border">
                  <div className="p-8 text-center">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-30" />
                    <p className="text-sm text-muted-foreground">No hay comentarios en la bitácora</p>
                  </div>
                </Card>
              ) : (
                sortedComments.map((comment) => {
                  const isMASDACLI = comment.commentType === 'MASDACLI';
                  const requiresResponse = isMASDACLI && comment.requiresResponse;
                  const isResponse = comment.commentType === 'RTAMASDACL';
                  const isCOMUNICLI = comment.commentType === 'COMUNICLI';
                  const requiresApproval = isCOMUNICLI && comment.requiresApproval;
                  const isAPROBACLI = comment.commentType === 'APROBACLI';
                  
                  // Encontrar el comentario de respuesta si existe
                  const responseComment = comments.find(c => 
                    c.commentType === 'RTAMASDACL' && c.respondedToCommentId === comment.id
                  );

                  // Encontrar comentario de aprobación/rechazo si existe
                  const approvalComment = comments.find(c => 
                    c.commentType === 'APROBACLI' && c.approvedCommentId === comment.id
                  );

                  return (
                    <div key={comment.id}>
                      <Card 
                        className={`${
                          (requiresResponse || requiresApproval)
                            ? 'bg-[#f28737]/10 border-[#f28737]/50 border-2' 
                            : comment.userRole === 'SUPERADMIN' 
                              ? 'bg-primary/5 border-primary/20' 
                              : 'bg-card/30'
                        } border-border`}
                      >
                        <div className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                                comment.userRole === 'SUPERADMIN'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-secondary text-secondary-foreground'
                              }`}>
                                {comment.userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="text-sm font-semibold text-foreground">
                                  {comment.userName}
                                </span>
                                {comment.userRole === 'SUPERADMIN' && (
                                  <Badge variant="outline" className="text-xs bg-primary/20 text-primary border-primary/30">
                                    Admin
                                  </Badge>
                                )}
                                {requiresResponse && (
                                  <Badge className="text-xs bg-[#f28737] text-white">
                                    SOLICITA INFORMACIÓN
                                  </Badge>
                                )}
                                {requiresApproval && (
                                  <Badge className="text-xs bg-[#f28737] text-white">
                                    SOLICITA APROBACIÓN
                                  </Badge>
                                )}
                                {isResponse && (
                                  <Badge variant="outline" className="text-xs bg-chart-4/20 text-chart-4 border-chart-4/30">
                                    Respuesta del Cliente
                                  </Badge>
                                )}
                                {isAPROBACLI && (
                                  <Badge variant="outline" className={`text-xs ${
                                    comment.approved 
                                      ? 'bg-green-500/20 text-green-500 border-green-500/30' 
                                      : 'bg-red-500/20 text-red-500 border-red-500/30'
                                  }`}>
                                    {comment.approved ? 'Aprobado' : 'Rechazado'}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-foreground mb-2 whitespace-pre-wrap">{comment.content}</p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(comment.timestamp), "d/M/yyyy HH:mm", { locale: es })}
                              </p>
                              {requiresResponse && (
                                <Button
                                  size="sm"
                                  className="mt-3 bg-[#f28737] hover:bg-[#f28737]/90 text-white"
                                  onClick={() => handleRespond(comment.id)}
                                >
                                  RESPONDER
                                </Button>
                              )}
                              {requiresApproval && (
                                <div className="flex gap-2 mt-3">
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => handleApprove(comment.id)}
                                  >
                                    APROBAR
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleReject(comment.id)}
                                  >
                                    RECHAZAR
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                      
                      {/* Mostrar respuesta si existe */}
                      {responseComment && (
                        <div className="ml-8 mt-2">
                          <Card className="bg-chart-4/10 border-chart-4/30 border-l-4">
                            <div className="p-4">
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold bg-secondary text-secondary-foreground">
                                    {responseComment.userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-semibold text-foreground">
                                      {responseComment.userName}
                                    </span>
                                    <Badge variant="outline" className="text-xs bg-chart-4/20 text-chart-4 border-chart-4/30">
                                      Respondió
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-foreground mb-2 whitespace-pre-wrap">{responseComment.content}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {format(new Date(responseComment.timestamp), "d/M/yyyy HH:mm", { locale: es })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Bottom spacing */}
          <div className="pb-4" />
        </div>
      </ScrollArea>

      {/* Comments Dialog */}
      <Dialog open={showCommentsDialog} onOpenChange={(open) => {
        setShowCommentsDialog(open);
        if (!open) {
          setRespondingToCommentId(null);
          setApprovingCommentId(null);
          setNewComment('');
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {respondingToCommentId 
                ? 'Responder a Solicitud de Información' 
                : approvingCommentId 
                  ? 'Rechazar Desarrollo' 
                  : 'Nuevo Comentario'}
            </DialogTitle>
          </DialogHeader>

          {respondingToCommentId && (
            <div className="mb-3 p-3 bg-[#f28737]/10 border border-[#f28737]/30 rounded">
              <p className="text-xs text-muted-foreground mb-1">Respondiendo a:</p>
              <p className="text-sm text-foreground">
                {comments.find(c => c.id === respondingToCommentId)?.content}
              </p>
            </div>
          )}

          {approvingCommentId && (
            <div className="mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded">
              <p className="text-xs text-muted-foreground mb-1">Rechazando desarrollo:</p>
              <p className="text-sm text-foreground">
                {comments.find(c => c.id === approvingCommentId)?.content}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Por favor, explica el motivo del rechazo:
              </p>
            </div>
          )}

          <div className="space-y-4">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={
                respondingToCommentId 
                  ? "Escribe tu respuesta..." 
                  : approvingCommentId 
                    ? "Explica por qué no apruebas el desarrollo..." 
                    : "Escribe tu comentario..."
              }
              className="min-h-[120px]"
              rows={5}
            />
            <div className="flex gap-2">
              <Button 
                onClick={() => {
                  if (respondingToCommentId) {
                    handleAddCommentWithApproval('RTAMASDACL', respondingToCommentId);
                  } else if (approvingCommentId) {
                    handleAddCommentWithApproval('APROBACLI', approvingCommentId, false);
                  } else {
                    handleAddCommentWithApproval('NORMAL');
                  }
                }}
                className="flex-1"
                disabled={!newComment.trim()}
              >
                {respondingToCommentId 
                  ? 'Enviar Respuesta' 
                  : approvingCommentId 
                    ? 'Enviar Rechazo' 
                    : 'Agregar Comentario'}
              </Button>
              {(respondingToCommentId || approvingCommentId) && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    setRespondingToCommentId(null);
                    setApprovingCommentId(null);
                    setNewComment('');
                  }}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};