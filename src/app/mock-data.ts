import { 
  Company, 
  User, 
  Ticket, 
  Chat, 
  Project, 
  Invoice, 
  AccountMovement,
  ChatMessage,
  Notification
} from './types';

// Companies
export const mockCompanies: Company[] = [
  { id: '1', name: 'TechCorp S.A.', email: 'info@techcorp.com', phone: '+54 11 4444-5555' },
  { id: '2', name: 'Innovate Ltd.', email: 'contacto@innovate.com', phone: '+54 11 5555-6666' },
  { id: '3', name: 'Digital Solutions', email: 'info@digitalsol.com', phone: '+54 11 6666-7777' },
];

// Users
export const mockUsers: User[] = [
  // TechCorp users
  { 
    id: '1', 
    email: 'juan.perez@techcorp.com', 
    name: 'Juan Pérez', 
    phone: '+54 911 1234-5678',
    role: 'CLIENT', 
    status: 'APPROVED', 
    companyId: '1',
    createdAt: '2024-01-10T10:00:00Z'
  },
  { 
    id: '2', 
    email: 'maria.garcia@techcorp.com', 
    name: 'María García', 
    phone: '+54 911 2345-6789',
    role: 'CLIENT', 
    status: 'PENDING', 
    companyId: '1',
    createdBy: '1',
    createdAt: '2025-01-03T14:30:00Z'
  },
  // Innovate users
  { 
    id: '3', 
    email: 'carlos.lopez@innovate.com', 
    name: 'Carlos López', 
    phone: '+54 911 3456-7890',
    role: 'CLIENT', 
    status: 'APPROVED', 
    companyId: '2',
    createdAt: '2024-02-15T09:00:00Z'
  },
  { 
    id: '4', 
    email: 'ana.martinez@innovate.com', 
    name: 'Ana Martínez', 
    phone: '+54 911 4567-8901',
    role: 'CLIENT', 
    status: 'APPROVED', 
    companyId: '2',
    createdBy: '3',
    createdAt: '2024-05-20T11:00:00Z'
  },
  // Digital Solutions users
  { 
    id: '5', 
    email: 'pedro.sanchez@digitalsol.com', 
    name: 'Pedro Sánchez', 
    phone: '+54 911 5678-9012',
    role: 'CLIENT', 
    status: 'APPROVED', 
    companyId: '3',
    createdAt: '2024-03-01T08:00:00Z'
  },
  // Superadmin
  { 
    id: 'admin1', 
    email: 'admin@jubbler.com', 
    name: 'Admin Jubbler', 
    phone: '+54 11 9999-0000',
    role: 'SUPERADMIN', 
    status: 'APPROVED', 
    companyId: 'jubbler',
    createdAt: '2023-01-01T00:00:00Z'
  },
];

// Tickets
export const mockTickets: Ticket[] = [
  {
    id: 'T-001',
    type: 'INCIDENT',
    title: 'Error en módulo de facturación',
    description: 'Al generar una factura, el sistema muestra un error 500',
    status: 'OPEN',
    priority: 'HIGH',
    companyId: '1',
    createdBy: '1',
    createdByName: 'Juan Pérez',
    createdAt: '2025-01-05T10:30:00Z',
    updatedAt: '2025-01-05T10:30:00Z'
  },
  {
    id: 'T-002',
    type: 'REQUIREMENT',
    title: 'Exportación de reportes en Excel',
    description: 'Solicitud para agregar la funcionalidad de exportar reportes a formato Excel',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    companyId: '1',
    createdBy: '1',
    createdByName: 'Juan Pérez',
    createdAt: '2024-12-20T14:00:00Z',
    updatedAt: '2025-01-02T09:00:00Z'
  },
  {
    id: 'T-003',
    type: 'INCIDENT',
    title: 'Login no funciona en Safari',
    description: 'Los usuarios que utilizan Safari no pueden iniciar sesión',
    status: 'RESOLVED',
    priority: 'URGENT',
    companyId: '2',
    createdBy: '3',
    createdByName: 'Carlos López',
    createdAt: '2024-12-28T11:15:00Z',
    updatedAt: '2024-12-29T16:45:00Z'
  },
  {
    id: 'T-004',
    type: 'REQUIREMENT',
    title: 'Dashboard personalizado',
    description: 'Crear un dashboard personalizado con métricas específicas del negocio',
    status: 'OPEN',
    priority: 'LOW',
    companyId: '2',
    createdBy: '4',
    createdByName: 'Ana Martínez',
    createdAt: '2025-01-04T09:30:00Z',
    updatedAt: '2025-01-04T09:30:00Z'
  },
  {
    id: 'T-005',
    type: 'INCIDENT',
    title: 'Lentitud en carga de datos',
    description: 'El sistema tarda más de 30 segundos en cargar el listado de clientes',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    companyId: '3',
    createdBy: '5',
    createdByName: 'Pedro Sánchez',
    createdAt: '2025-01-03T13:20:00Z',
    updatedAt: '2025-01-04T10:00:00Z'
  }
];

// Chat messages
const createChatMessages = (chatId: string, isOpen: boolean = true): ChatMessage[] => {
  const baseMessages: ChatMessage[] = [
    {
      id: `${chatId}-msg-1`,
      chatId,
      senderId: '1',
      senderName: 'Juan Pérez',
      senderType: 'CLIENT',
      type: 'TEXT',
      content: 'Hola, necesito ayuda con un problema en el sistema',
      timestamp: '2025-01-05T10:00:00Z',
      read: true
    },
    {
      id: `${chatId}-msg-2`,
      chatId,
      senderId: 'admin1',
      senderName: 'Admin Jubbler',
      senderType: 'AGENT',
      type: 'TEXT',
      content: '¡Hola Juan! Gracias por comunicarte con Jubbler Technologies. ¿En qué podemos ayudarte?',
      timestamp: '2025-01-05T10:02:00Z',
      read: true
    },
    {
      id: `${chatId}-msg-3`,
      chatId,
      senderId: '1',
      senderName: 'Juan Pérez',
      senderType: 'CLIENT',
      type: 'TEXT',
      content: 'Tengo un error al generar facturas. Adjunto captura de pantalla',
      timestamp: '2025-01-05T10:03:00Z',
      read: true
    },
    {
      id: `${chatId}-msg-4`,
      chatId,
      senderId: '1',
      senderName: 'Juan Pérez',
      senderType: 'CLIENT',
      type: 'IMAGE',
      content: 'Captura de error',
      fileUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500',
      fileName: 'error-screenshot.png',
      timestamp: '2025-01-05T10:03:30Z',
      read: true
    },
    {
      id: `${chatId}-msg-5`,
      chatId,
      senderId: 'admin1',
      senderName: 'Admin Jubbler',
      senderType: 'AGENT',
      type: 'TEXT',
      content: 'Gracias por la información. Ya estoy revisando el error. Te envío un documento con la solución temporal.',
      timestamp: '2025-01-05T10:15:00Z',
      read: true
    },
    {
      id: `${chatId}-msg-6`,
      chatId,
      senderId: 'admin1',
      senderName: 'Admin Jubbler',
      senderType: 'AGENT',
      type: 'PDF',
      content: 'Documento con solución',
      fileUrl: '#',
      fileName: 'solucion-facturacion.pdf',
      timestamp: '2025-01-05T10:16:00Z',
      read: true
    }
  ];

  if (isOpen) {
    baseMessages.push({
      id: `${chatId}-msg-7`,
      chatId,
      senderId: '1',
      senderName: 'Juan Pérez',
      senderType: 'CLIENT',
      type: 'TEXT',
      content: '¿Pueden ayudarme con otra consulta?',
      timestamp: '2025-01-06T09:30:00Z',
      read: false
    });
  }

  return baseMessages;
};

// Chats
export const mockChats: Chat[] = [
  // TechCorp - Chat activo actual
  {
    id: 'chat-1',
    companyId: '1',
    companyName: 'TechCorp S.A.',
    userId: '1',
    userName: 'Juan Pérez',
    userEmail: 'juan.perez@techcorp.com',
    subject: 'Consulta sobre facturación',
    lastMessage: '¿Pueden ayudarme con otra consulta?',
    lastMessageTime: '2025-01-06T09:30:00Z',
    unreadCount: 1,
    status: 'ACTIVE',
    messages: createChatMessages('chat-1', true),
    createdAt: '2025-01-05T09:00:00Z'
  },
  // TechCorp - Chat cerrado 1
  {
    id: 'chat-4',
    companyId: '1',
    companyName: 'TechCorp S.A.',
    userId: '1',
    userName: 'Juan Pérez',
    userEmail: 'juan.perez@techcorp.com',
    subject: 'Problema con módulo de inventario',
    lastMessage: 'Perfecto, ya quedó resuelto. Gracias!',
    lastMessageTime: '2025-01-03T14:20:00Z',
    unreadCount: 0,
    status: 'CLOSED',
    messages: [
      {
        id: 'chat-4-msg-1',
        chatId: 'chat-4',
        senderId: '1',
        senderName: 'Juan Pérez',
        senderType: 'CLIENT',
        type: 'TEXT',
        content: 'Hola, tengo un problema con el módulo de inventario',
        timestamp: '2025-01-03T10:00:00Z',
        read: true
      },
      {
        id: 'chat-4-msg-2',
        chatId: 'chat-4',
        senderId: 'admin1',
        senderName: 'Admin Jubbler',
        senderType: 'AGENT',
        type: 'TEXT',
        content: 'Hola Juan, ¿podrías darme más detalles del problema?',
        timestamp: '2025-01-03T10:15:00Z',
        read: true
      },
      {
        id: 'chat-4-msg-3',
        chatId: 'chat-4',
        senderId: '1',
        senderName: 'Juan Pérez',
        senderType: 'CLIENT',
        type: 'TEXT',
        content: 'No me permite actualizar las cantidades de stock',
        timestamp: '2025-01-03T10:20:00Z',
        read: true
      },
      {
        id: 'chat-4-msg-4',
        chatId: 'chat-4',
        senderId: 'admin1',
        senderName: 'Admin Jubbler',
        senderType: 'AGENT',
        type: 'TEXT',
        content: 'Ya lo revisé y lo solucioné. Fue un problema de permisos.',
        timestamp: '2025-01-03T14:00:00Z',
        read: true
      },
      {
        id: 'chat-4-msg-5',
        chatId: 'chat-4',
        senderId: '1',
        senderName: 'Juan Pérez',
        senderType: 'CLIENT',
        type: 'TEXT',
        content: 'Perfecto, ya quedó resuelto. Gracias!',
        timestamp: '2025-01-03T14:20:00Z',
        read: true
      }
    ],
    createdAt: '2025-01-03T10:00:00Z',
    closedAt: '2025-01-03T14:20:00Z'
  },
  // TechCorp - Chat cerrado 2
  {
    id: 'chat-5',
    companyId: '1',
    companyName: 'TechCorp S.A.',
    userId: '1',
    userName: 'Juan Pérez',
    userEmail: 'juan.perez@techcorp.com',
    subject: 'Solicitud de reporte personalizado',
    lastMessage: 'Excelente, muchas gracias!',
    lastMessageTime: '2024-12-28T16:45:00Z',
    unreadCount: 0,
    status: 'CLOSED',
    messages: [
      {
        id: 'chat-5-msg-1',
        chatId: 'chat-5',
        senderId: '1',
        senderName: 'Juan Pérez',
        senderType: 'CLIENT',
        type: 'TEXT',
        content: 'Necesito un reporte de ventas del último trimestre',
        timestamp: '2024-12-28T14:00:00Z',
        read: true
      },
      {
        id: 'chat-5-msg-2',
        chatId: 'chat-5',
        senderId: 'admin1',
        senderName: 'Admin Jubbler',
        senderType: 'AGENT',
        type: 'TEXT',
        content: 'Claro, te lo preparo y te lo envío en PDF',
        timestamp: '2024-12-28T14:30:00Z',
        read: true
      },
      {
        id: 'chat-5-msg-3',
        chatId: 'chat-5',
        senderId: 'admin1',
        senderName: 'Admin Jubbler',
        senderType: 'AGENT',
        type: 'PDF',
        content: 'Reporte de ventas Q4 2024',
        fileName: 'ventas-q4-2024.pdf',
        timestamp: '2024-12-28T16:00:00Z',
        read: true
      },
      {
        id: 'chat-5-msg-4',
        chatId: 'chat-5',
        senderId: '1',
        senderName: 'Juan Pérez',
        senderType: 'CLIENT',
        type: 'TEXT',
        content: 'Excelente, muchas gracias!',
        timestamp: '2024-12-28T16:45:00Z',
        read: true
      }
    ],
    createdAt: '2024-12-28T14:00:00Z',
    closedAt: '2024-12-28T16:45:00Z'
  },
  // TechCorp - Chat pendiente fuera de horario
  {
    id: 'chat-6',
    companyId: '1',
    companyName: 'TechCorp S.A.',
    userId: '1',
    userName: 'Juan Pérez',
    userEmail: 'juan.perez@techcorp.com',
    subject: 'Consulta urgente sobre cierre de mes',
    lastMessage: 'Necesito ayuda urgente con el cierre de mes',
    lastMessageTime: '2025-01-05T22:30:00Z',
    unreadCount: 1,
    status: 'PENDING_OUTSIDE_HOURS',
    messages: [
      {
        id: 'chat-6-msg-1',
        chatId: 'chat-6',
        senderId: '1',
        senderName: 'Juan Pérez',
        senderType: 'CLIENT',
        type: 'TEXT',
        content: 'Necesito ayuda urgente con el cierre de mes',
        timestamp: '2025-01-05T22:30:00Z',
        read: false
      }
    ],
    createdAt: '2025-01-05T22:30:00Z'
  },
  // Innovate Ltd - Chat cerrado
  {
    id: 'chat-2',
    companyId: '2',
    companyName: 'Innovate Ltd.',
    userId: '3',
    userName: 'Carlos López',
    userEmail: 'carlos.lopez@innovate.com',
    subject: 'Configuración de usuarios',
    lastMessage: 'Perfecto, muchas gracias',
    lastMessageTime: '2025-01-05T15:00:00Z',
    unreadCount: 0,
    status: 'CLOSED',
    messages: createChatMessages('chat-2', false),
    createdAt: '2025-01-05T09:00:00Z',
    closedAt: '2025-01-05T15:00:00Z'
  },
  // Digital Solutions - Chat activo
  {
    id: 'chat-3',
    companyId: '3',
    companyName: 'Digital Solutions',
    userId: '5',
    userName: 'Pedro Sánchez',
    userEmail: 'pedro.sanchez@digitalsol.com',
    subject: 'Información sobre el proyecto',
    lastMessage: 'Necesito información sobre el proyecto',
    lastMessageTime: '2025-01-04T16:20:00Z',
    unreadCount: 2,
    status: 'ACTIVE',
    messages: createChatMessages('chat-3', true),
    createdAt: '2025-01-04T16:20:00Z'
  },
  // Digital Solutions - Chat cerrado
  {
    id: 'chat-7',
    companyId: '3',
    companyName: 'Digital Solutions',
    userId: '5',
    userName: 'Pedro Sánchez',
    userEmail: 'pedro.sanchez@digitalsol.com',
    subject: 'Acceso al portal',
    lastMessage: 'Ya pude ingresar, gracias',
    lastMessageTime: '2025-01-02T11:30:00Z',
    unreadCount: 0,
    status: 'CLOSED',
    messages: [
      {
        id: 'chat-7-msg-1',
        chatId: 'chat-7',
        senderId: '5',
        senderName: 'Pedro Sánchez',
        senderType: 'CLIENT',
        type: 'TEXT',
        content: 'No puedo ingresar al portal de clientes',
        timestamp: '2025-01-02T10:00:00Z',
        read: true
      },
      {
        id: 'chat-7-msg-2',
        chatId: 'chat-7',
        senderId: 'admin1',
        senderName: 'Admin Jubbler',
        senderType: 'AGENT',
        type: 'TEXT',
        content: 'Ya te restablecí la contraseña. Revisa tu email.',
        timestamp: '2025-01-02T10:30:00Z',
        read: true
      },
      {
        id: 'chat-7-msg-3',
        chatId: 'chat-7',
        senderId: '5',
        senderName: 'Pedro Sánchez',
        senderType: 'CLIENT',
        type: 'TEXT',
        content: 'Ya pude ingresar, gracias',
        timestamp: '2025-01-02T11:30:00Z',
        read: true
      }
    ],
    createdAt: '2025-01-02T10:00:00Z',
    closedAt: '2025-01-02T11:30:00Z'
  }
];

// Projects
export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Sistema de Gestión ERP',
    description: 'Implementación de sistema ERP completo',
    companyId: '1',
    scheduleUrl: 'https://example.com/schedule/proj-1',
    status: 'ACTIVE',
    startDate: '2024-06-01',
    estimatedEndDate: '2025-03-31'
  },
  {
    id: 'proj-2',
    name: 'Migración Cloud',
    description: 'Migración de infraestructura a la nube',
    companyId: '1',
    scheduleUrl: 'https://example.com/schedule/proj-2',
    status: 'ACTIVE',
    startDate: '2024-10-01',
    estimatedEndDate: '2025-06-30'
  },
  {
    id: 'proj-3',
    name: 'Desarrollo App Mobile',
    description: 'Aplicación móvil para clientes',
    companyId: '2',
    scheduleUrl: 'https://example.com/schedule/proj-3',
    status: 'ACTIVE',
    startDate: '2024-08-15',
    estimatedEndDate: '2025-02-28'
  },
  {
    id: 'proj-4',
    name: 'Portal de Clientes',
    description: 'Portal web para autogestión de clientes',
    companyId: '3',
    scheduleUrl: 'https://example.com/schedule/proj-4',
    status: 'COMPLETED',
    startDate: '2024-03-01',
    estimatedEndDate: '2024-12-31'
  }
];

// Invoices
export const mockInvoices: Invoice[] = [
  {
    id: 'inv-1',
    number: 'FC-0001-00001234',
    companyId: '1',
    date: '2024-12-01',
    dueDate: '2024-12-31',
    amount: 150000,
    balance: 0,
    status: 'PAID',
    pdfUrl: '#invoice-1.pdf'
  },
  {
    id: 'inv-2',
    number: 'FC-0001-00001235',
    companyId: '1',
    date: '2025-01-01',
    dueDate: '2025-01-31',
    amount: 175000,
    balance: 175000,
    status: 'PENDING',
    pdfUrl: '#invoice-2.pdf'
  },
  {
    id: 'inv-3',
    number: 'FC-0002-00000456',
    companyId: '2',
    date: '2024-11-15',
    dueDate: '2024-12-15',
    amount: 220000,
    balance: 220000,
    status: 'OVERDUE',
    pdfUrl: '#invoice-3.pdf'
  },
  {
    id: 'inv-4',
    number: 'FC-0002-00000457',
    companyId: '2',
    date: '2024-12-15',
    dueDate: '2025-01-15',
    amount: 195000,
    balance: 0,
    status: 'PAID',
    pdfUrl: '#invoice-4.pdf'
  }
];

// Account Movements
export const mockAccountMovements: AccountMovement[] = [
  {
    id: 'mov-1',
    companyId: '1',
    date: '2024-12-01',
    description: 'Factura FC-0001-00001234',
    debit: 150000,
    credit: 0,
    balance: 150000,
    invoiceId: 'inv-1'
  },
  {
    id: 'mov-2',
    companyId: '1',
    date: '2024-12-15',
    description: 'Pago recibido - Transferencia',
    debit: 0,
    credit: 150000,
    balance: 0,
    invoiceId: 'inv-1'
  },
  {
    id: 'mov-3',
    companyId: '1',
    date: '2025-01-01',
    description: 'Factura FC-0001-00001235',
    debit: 175000,
    credit: 0,
    balance: 175000,
    invoiceId: 'inv-2'
  }
];

// Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: '1',
    type: 'NEW_MESSAGE',
    title: 'Nuevo mensaje',
    description: 'Tienes un nuevo mensaje de Admin Jubbler',
    timestamp: '2025-01-06T09:32:00Z',
    read: false,
    chatId: 'chat-1'
  },
  {
    id: 'notif-2',
    userId: '1',
    type: 'TICKET_UPDATE',
    title: 'Actualización de ticket',
    description: 'El ticket #T-002 cambió de estado a EN PROGRESO',
    timestamp: '2025-01-02T09:05:00Z',
    read: false,
    ticketId: 'T-002'
  },
  {
    id: 'notif-3',
    userId: '1',
    type: 'PROJECT_UPDATE',
    title: 'Actualización de proyecto',
    description: 'El proyecto Sistema de Gestión ERP fue actualizado',
    timestamp: '2025-01-05T14:20:00Z',
    read: false,
    projectId: 'proj-1'
  },
  {
    id: 'notif-4',
    userId: '2',
    type: 'USER_APPROVED',
    title: 'Usuario aprobado',
    description: 'Tu usuario fue aprobado por la administración',
    timestamp: '2025-01-04T11:00:00Z',
    read: true
  },
  {
    id: 'notif-5',
    userId: '1',
    type: 'NEW_MESSAGE',
    title: 'Nuevo mensaje',
    description: 'Tienes un nuevo mensaje de Admin Jubbler',
    timestamp: '2024-12-28T16:05:00Z',
    read: true,
    chatId: 'chat-5'
  },
  {
    id: 'notif-6',
    userId: '1',
    type: 'TICKET_UPDATE',
    title: 'Ticket resuelto',
    description: 'El ticket #T-003 cambió de estado a RESUELTO',
    timestamp: '2024-12-29T16:50:00Z',
    read: true,
    ticketId: 'T-003'
  }
];