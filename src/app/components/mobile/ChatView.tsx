import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockChats } from '../../mock-data';
import { Chat, ChatMessage, MessageType } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { GalaxyBackground } from '../GalaxyBackground';
import { 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  FileText, 
  Mic, 
  ArrowLeft,
  Download,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';

interface ChatViewProps {
  selectedChatId?: string | null;
}

export const ChatView: React.FC<ChatViewProps> = ({ selectedChatId }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>(
    mockChats.filter(c => c.companyId === user?.companyId)
  );
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-seleccionar chat cuando viene de notificación
  useEffect(() => {
    if (selectedChatId) {
      const chat = chats.find(c => c.id === selectedChatId);
      if (chat) {
        setSelectedChat(chat);
      }
    }
  }, [selectedChatId, chats]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (selectedChat) {
      scrollToBottom();
    }
  }, [selectedChat?.messages]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedChat || !user) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      chatId: selectedChat.id,
      senderId: user.id,
      senderName: user.name,
      senderType: 'CLIENT',
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

    // Simulate auto-response
    setTimeout(() => {
      const autoReply: ChatMessage = {
        id: `msg-${Date.now()}-auto`,
        chatId: selectedChat.id,
        senderId: 'admin1',
        senderName: 'Admin Jubbler',
        senderType: 'AGENT',
        type: 'TEXT',
        content: 'Gracias por tu mensaje. Un agente te responderá a la brevedad.',
        timestamp: new Date().toISOString(),
        read: false
      };

      const chatWithReply = {
        ...updatedChat,
        messages: [...updatedChat.messages, autoReply],
        lastMessage: autoReply.content,
        lastMessageTime: autoReply.timestamp,
        unreadCount: updatedChat.unreadCount + 1
      };

      setChats(chats.map(c => c.id === selectedChat.id ? chatWithReply : c));
      setSelectedChat(chatWithReply);
    }, 1500);
  };

  const handleAttachment = (type: MessageType) => {
    toast.info(`Función de adjuntar ${type} disponible próximamente`);
  };

  const handleCreateNewChat = () => {
    if (!user) return;

    const newChatId = `chat-${Date.now()}`;
    const now = new Date().toISOString();

    // Mensaje automático de bienvenida
    const welcomeMessage: ChatMessage = {
      id: `msg-${Date.now()}-welcome`,
      chatId: newChatId,
      senderId: 'admin1',
      senderName: 'Soporte Jubbler',
      senderType: 'AGENT',
      type: 'TEXT',
      content: '¡Hola! Bienvenido al chat de soporte de Jubbler Technologies. ¿En qué podemos ayudarte hoy?',
      timestamp: now,
      read: false
    };

    const newChat: Chat = {
      id: newChatId,
      companyId: user.companyId,
      companyName: '', // Will be filled from company data
      userId: user.id,
      userName: 'Soporte Jubbler',
      userEmail: 'soporte@jubbler.com',
      subject: 'Nueva consulta',
      lastMessage: welcomeMessage.content,
      lastMessageTime: now,
      unreadCount: 1,
      status: 'ACTIVE',
      messages: [welcomeMessage],
      createdAt: now
    };

    setChats([newChat, ...chats]);
    setSelectedChat(newChat);
    toast.success('Nueva conversación iniciada');
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
  };

  const renderMessage = (message: ChatMessage) => {
    const isClient = message.senderType === 'CLIENT';

    return (
      <div
        key={message.id}
        className={`flex ${isClient ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`max-w-[75%] ${isClient ? 'order-2' : 'order-1'}`}>
          {!isClient && (
            <div className="text-xs text-gray-500 mb-1">{message.senderName}</div>
          )}
          <div
            className={`rounded-lg px-4 py-2 ${
              isClient
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-900'
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
                <FileText className="h-8 w-8" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{message.fileName}</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className={isClient ? 'text-white hover:text-white' : ''}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Descargar
                  </Button>
                </div>
              </div>
            )}

            {message.type === 'AUDIO' && (
              <div className="flex items-center gap-2">
                <Mic className="h-6 w-6" />
                <div className="flex-1">
                  <div className="h-8 bg-white/20 rounded-full" />
                </div>
              </div>
            )}
          </div>
          <div className="text-xs text-gray-500 mt-1 text-right">
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    );
  };

  // Chat List View
  if (!selectedChat) {
    return (
      <div className="h-full flex flex-col bg-background relative">
        {/* Galaxy Background */}
        <GalaxyBackground />
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col">
          <div className="p-4 border-b border-border bg-card/80 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-foreground">Chat de Soporte</h2>
          </div>

          <div className="flex-1 overflow-auto p-4 space-y-3 bg-background">
            {chats.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No tienes conversaciones activas</p>
                <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleCreateNewChat}>
                  Iniciar Chat
                </Button>
              </div>
            ) : (
              <>
                {chats.map(chat => (
                  <Card
                    key={chat.id}
                    className="p-4 cursor-pointer hover:bg-secondary transition-shadow bg-card border-border"
                    onClick={() => setSelectedChat(chat)}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {chat.userName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium truncate text-foreground">{chat.userName}</h3>
                          {chat.lastMessageTime && (
                            <span className="text-xs text-muted-foreground">
                              {formatTime(chat.lastMessageTime)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                      </div>
                      {chat.unreadCount > 0 && (
                        <Badge className="bg-primary text-primary-foreground">{chat.unreadCount}</Badge>
                      )}
                    </div>
                  </Card>
                ))}
                <Button 
                  className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90" 
                  variant="outline"
                  onClick={handleCreateNewChat}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Iniciar Nuevo Chat
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Chat Conversation View
  return (
    <div className="h-full flex flex-col bg-background relative">
      {/* Galaxy Background */}
      <GalaxyBackground />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border bg-card/80 backdrop-blur-sm flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedChat(null)}
            className="text-foreground hover:bg-secondary"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar>
            <AvatarFallback className="bg-primary/20 text-primary">
              {selectedChat.userName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-medium text-foreground">{selectedChat.userName}</h3>
            <p className="text-xs text-muted-foreground">
              {selectedChat.status === 'ACTIVE' ? 'Activo' : 'Cerrado'}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-auto p-4 bg-background">
          {selectedChat.messages.map(message => renderMessage(message))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {selectedChat.status === 'ACTIVE' && (
          <div className="p-4 border-t border-border bg-card">
            <div className="flex gap-2 mb-2">
              <Button
                variant="outline"
                size="sm"
                className="border-border hover:bg-secondary text-foreground"
                onClick={() => handleAttachment('IMAGE')}
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-border hover:bg-secondary text-foreground"
                onClick={() => handleAttachment('PDF')}
              >
                <FileText className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-border hover:bg-secondary text-foreground"
                onClick={() => handleAttachment('AUDIO')}
              >
                <Mic className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Escribe un mensaje..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="bg-background border-border text-foreground"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button onClick={handleSendMessage} disabled={!messageText.trim()} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};