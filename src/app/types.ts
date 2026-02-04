// User and Authentication Types
export type UserStatus = 'APPROVED' | 'PENDING' | 'REJECTED';
export type UserRole = 'CLIENT' | 'SUPERADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  companyId: string;
  createdBy?: string;
  createdAt: string;
  // Permisos para usuarios CLIENT
  canViewProjects?: boolean;
  canViewAccount?: boolean;
  canViewUsers?: boolean;
}

export interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
}

// Ticket Types
export type TicketType = 'INCIDENT' | 'REQUIREMENT';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TicketUrgency = 'LOW' | 'MEDIUM' | 'HIGH';
export type TicketImpact = 'LOW' | 'MEDIUM' | 'HIGH';
export type TicketOrigin = 'WEB' | 'EMAIL' | 'PHONE' | 'MOBILE';
export type CommentType = 'NORMAL' | 'MASDACLI' | 'RTAMASDACL' | 'COMUNICLI' | 'APROBACLI';

export interface TicketComment {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  userRole: 'CLIENT' | 'SUPERADMIN';
  content: string;
  timestamp: string;
  read: boolean;
  commentType?: CommentType; // Tipo de comentario
  requiresResponse?: boolean; // Si es MASDACLI y aún no ha sido respondido
  requiresApproval?: boolean; // Si es COMUNICLI y aún no ha sido aprobado/rechazado
  respondedToCommentId?: string; // Si es RTAMASDACL, ID del comentario MASDACLI al que responde
  approvedCommentId?: string; // Si es APROBACLI, ID del comentario COMUNICLI al que aprueba/rechaza
  approved?: boolean; // Si es APROBACLI, si fue aprobado (true) o rechazado (false)
}

export interface Ticket {
  id: string;
  type: TicketType;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  urgency: TicketUrgency;
  impact: TicketImpact;
  origin: TicketOrigin;
  companyId: string;
  companyName?: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  comments: TicketComment[];
  hasUnreadComments?: boolean;
  hasActionRequired?: boolean; // Si hay un MASDACLI sin responder
}

// Chat Types
export type MessageType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'PDF' | 'AUDIO';
export type MessageSender = 'CLIENT' | 'AGENT';

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderType: MessageSender;
  type: MessageType;
  content: string;
  fileUrl?: string;
  fileName?: string;
  timestamp: string;
  read: boolean;
}

export interface Chat {
  id: string;
  companyId: string;
  companyName: string;
  userId: string;
  userName: string;
  userEmail: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  status: 'ACTIVE' | 'CLOSED' | 'PENDING_OUTSIDE_HOURS';
  messages: ChatMessage[];
  createdAt: string;
  closedAt?: string;
  subject?: string;
  assignedTo?: string; // ID del admin asignado
}

// Project Types
export interface Project {
  id: string;
  name: string;
  description: string;
  companyId: string;
  scheduleUrl: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';
  startDate: string;
  estimatedEndDate?: string;
}

// Invoice Types
export interface Invoice {
  id: string;
  number: string;
  companyId: string;
  date: string;
  dueDate: string;
  amount: number;
  balance: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  pdfUrl: string;
}

// Account Movement Types
export interface AccountMovement {
  id: string;
  companyId: string;
  date: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  invoiceId?: string;
}

// Notification Types
export type NotificationType = 'NEW_MESSAGE' | 'TICKET_UPDATE' | 'PROJECT_UPDATE' | 'USER_APPROVED';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  userId: string;
  // Metadata para navegación
  chatId?: string;
  ticketId?: string;
  projectId?: string;
}

// Admin/Agent Types
export interface Admin {
  id: string;
  name: string;
  email: string;
}