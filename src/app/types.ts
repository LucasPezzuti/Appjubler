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

export interface Ticket {
  id: string;
  type: TicketType;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  companyId: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
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