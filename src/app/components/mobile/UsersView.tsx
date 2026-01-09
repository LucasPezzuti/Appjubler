import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockUsers, mockCompanies } from '../../mock-data';
import { User, UserStatus } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Switch } from '../ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { 
  Plus, 
  Mail, 
  Phone, 
  UserPlus, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Shield, 
  Edit, 
  Trash2,
  AlertTriangle 
} from 'lucide-react';
import { toast } from 'sonner';
import { GalaxyBackground } from '../GalaxyBackground';

export const UsersView: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>(
    mockUsers.filter(u => u.companyId === currentUser?.companyId)
  );
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    canViewProjects: true,
    canViewAccount: true,
    canViewUsers: true
  });

  const [editedUser, setEditedUser] = useState({
    name: '',
    phone: '',
    canViewProjects: true,
    canViewAccount: true,
    canViewUsers: true
  });

  const company = mockCompanies.find(c => c.id === currentUser?.companyId);

  // Verificar si el usuario actual es superAdmin (tiene todos los permisos)
  const isSuperAdmin = currentUser?.canViewProjects !== false && 
                       currentUser?.canViewAccount !== false && 
                       currentUser?.canViewUsers !== false;

  const handleCreateUser = () => {
    if (!currentUser) return;

    // Solo superAdmin puede crear usuarios
    if (!isSuperAdmin) {
      toast.error('Solo los super administradores pueden crear usuarios');
      return;
    }

    const user: User = {
      id: `user-${Date.now()}`,
      email: newUser.email,
      name: newUser.name,
      phone: newUser.phone,
      role: 'CLIENT',
      status: 'PENDING',
      companyId: currentUser.companyId,
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
      canViewProjects: newUser.canViewProjects,
      canViewAccount: newUser.canViewAccount,
      canViewUsers: newUser.canViewUsers
    };

    setUsers([...users, user]);
    setIsCreateOpen(false);
    setNewUser({ 
      name: '', 
      email: '', 
      phone: '', 
      password: '',
      canViewProjects: true,
      canViewAccount: true,
      canViewUsers: true
    });
    
    const isSuperUser = newUser.canViewProjects && newUser.canViewAccount && newUser.canViewUsers;
    toast.success(
      isSuperUser 
        ? 'Super usuario creado. Pendiente de aprobación por back-office.'
        : 'Usuario creado. Pendiente de aprobación por back-office.'
    );
  };

  const handleEditUser = (user: User) => {
    if (!isSuperAdmin) {
      toast.error('Solo los super administradores pueden editar usuarios');
      return;
    }
    
    if (user.id === currentUser?.id) {
      toast.error('No puedes editar tu propio usuario desde aquí. Usa la sección Mi Perfil.');
      return;
    }

    setEditingUser(user);
    setEditedUser({
      name: user.name,
      phone: user.phone,
      canViewProjects: user.canViewProjects !== false,
      canViewAccount: user.canViewAccount !== false,
      canViewUsers: user.canViewUsers !== false
    });
    setIsEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingUser) return;

    setUsers(users.map(u => 
      u.id === editingUser.id 
        ? { 
            ...u, 
            name: editedUser.name,
            phone: editedUser.phone,
            canViewProjects: editedUser.canViewProjects,
            canViewAccount: editedUser.canViewAccount,
            canViewUsers: editedUser.canViewUsers
          } 
        : u
    ));
    
    setIsEditOpen(false);
    setEditingUser(null);
    toast.success('Usuario actualizado exitosamente');
  };

  const handleDeleteUser = (user: User) => {
    if (!isSuperAdmin) {
      toast.error('Solo los super administradores pueden dar de baja usuarios');
      return;
    }

    if (user.id === currentUser?.id) {
      toast.error('No puedes dar de baja tu propio usuario');
      return;
    }

    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!userToDelete) return;

    setUsers(users.filter(u => u.id !== userToDelete.id));
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
    toast.success('Usuario dado de baja exitosamente');
  };

  const getStatusIcon = (status: UserStatus) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle className="h-4 w-4" />;
      case 'PENDING': return <Clock className="h-4 w-4" />;
      case 'REJECTED': return <XCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
    }
  };

  const getStatusText = (status: UserStatus) => {
    switch (status) {
      case 'APPROVED': return 'Aprobado';
      case 'PENDING': return 'Pendiente';
      case 'REJECTED': return 'Rechazado';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="h-full flex flex-col bg-background relative">
      {/* Galaxy Background */}
      <GalaxyBackground />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        <div className="p-4 border-b border-border bg-card/80 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-foreground">Usuarios</h2>
            {isSuperAdmin && (
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Usuario
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md bg-card border-border">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">Crear Nuevo Usuario</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      El usuario quedará pendiente de aprobación por el back-office
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-foreground">Nombre Completo</Label>
                      <Input
                        placeholder="Juan Pérez"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        className="bg-background border-border text-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-foreground">Email</Label>
                      <Input
                        type="email"
                        placeholder="juan@empresa.com"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        className="bg-background border-border text-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-foreground">Teléfono</Label>
                      <Input
                        type="tel"
                        placeholder="+54 911 1234-5678"
                        value={newUser.phone}
                        onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                        className="bg-background border-border text-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-foreground">Contraseña Inicial</Label>
                      <Input
                        type="password"
                        placeholder="Contraseña temporal"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        className="bg-background border-border text-foreground"
                      />
                      <p className="text-xs text-muted-foreground">
                        El usuario podrá cambiar su contraseña después del primer login
                      </p>
                    </div>

                    <div className="space-y-3 p-4 bg-muted rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-semibold text-foreground">Permisos de Acceso</Label>
                        {newUser.canViewProjects && newUser.canViewAccount && newUser.canViewUsers && (
                          <Badge className="bg-chart-5 text-white">
                            <Shield className="h-3 w-3 mr-1" />
                            Super Usuario
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-sm text-foreground">Proyectos</Label>
                          <p className="text-xs text-muted-foreground">Ver proyectos y cronogramas</p>
                        </div>
                        <Switch
                          checked={newUser.canViewProjects}
                          onCheckedChange={(checked) => setNewUser({ ...newUser, canViewProjects: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-sm text-foreground">Cuenta</Label>
                          <p className="text-xs text-muted-foreground">Ver cuenta corriente y facturas</p>
                        </div>
                        <Switch
                          checked={newUser.canViewAccount}
                          onCheckedChange={(checked) => setNewUser({ ...newUser, canViewAccount: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-sm text-foreground">Usuarios</Label>
                          <p className="text-xs text-muted-foreground">Gestionar usuarios de la empresa</p>
                        </div>
                        <Switch
                          checked={newUser.canViewUsers}
                          onCheckedChange={(checked) => setNewUser({ ...newUser, canViewUsers: checked })}
                        />
                      </div>
                    </div>

                    <Button onClick={handleCreateUser} className="w-full bg-primary hover:bg-primary/90">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Crear Usuario
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
          {company && (
            <p className="text-sm text-muted-foreground">{company.name}</p>
          )}
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-3">
          {users.map(user => (
            <Card key={user.id} className="bg-card border-border">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <CardTitle className="text-base truncate text-foreground">{user.name}</CardTitle>
                      <Badge className={`${
                        user.status === 'APPROVED' 
                          ? 'bg-chart-4/20 text-chart-4 border-chart-4/30'
                          : user.status === 'PENDING'
                          ? 'bg-chart-3/20 text-chart-3 border-chart-3/30'
                          : 'bg-destructive/20 text-destructive border-destructive/30'
                      } border`}>
                        {getStatusIcon(user.status)}
                        <span className="ml-1">{getStatusText(user.status)}</span>
                      </Badge>
                      {user.canViewProjects && user.canViewAccount && user.canViewUsers && (
                        <Badge className="bg-chart-5 text-white">
                          <Shield className="h-3 w-3 mr-1" />
                          Super Usuario
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{user.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {(user.canViewProjects !== undefined || user.canViewAccount !== undefined || user.canViewUsers !== undefined) && (
                  <div className="mb-3 flex gap-2 flex-wrap">
                    {user.canViewProjects && (
                      <Badge variant="outline" className="bg-background text-foreground border-border">
                        Proyectos
                      </Badge>
                    )}
                    {user.canViewAccount && (
                      <Badge variant="outline" className="bg-background text-foreground border-border">
                        Cuenta
                      </Badge>
                    )}
                    {user.canViewUsers && (
                      <Badge variant="outline" className="bg-background text-foreground border-border">
                        Usuarios
                      </Badge>
                    )}
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  Creado el {new Date(user.createdAt).toLocaleDateString('es-ES')}
                  {user.createdBy && user.createdBy !== user.id && (
                    <span className="block mt-1">
                      Creado por: {users.find(u => u.id === user.createdBy)?.name || 'Administrador'}
                    </span>
                  )}
                </div>
                {user.status === 'PENDING' && (
                  <div className="mt-3 p-3 bg-chart-3/10 rounded-md border border-chart-3/30">
                    <p className="text-sm text-chart-3">
                      Este usuario no puede iniciar sesión hasta que sea aprobado por el back-office de Jubbler.
                    </p>
                  </div>
                )}
                {isSuperAdmin && (
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={() => handleEditUser(user)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button size="sm" className="bg-red-500 hover:bg-red-600" onClick={() => handleDeleteUser(user)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Dar de Baja
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dialogo de edición */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-md bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Editar Usuario</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Actualiza la información del usuario
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-foreground">Nombre Completo</Label>
                <Input
                  placeholder="Juan Pérez"
                  value={editedUser.name}
                  onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Teléfono</Label>
                <Input
                  type="tel"
                  placeholder="+54 911 1234-5678"
                  value={editedUser.phone}
                  onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-3 p-4 bg-muted rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-semibold text-foreground">Permisos de Acceso</Label>
                  {editedUser.canViewProjects && editedUser.canViewAccount && editedUser.canViewUsers && (
                    <Badge className="bg-chart-5 text-white">
                      <Shield className="h-3 w-3 mr-1" />
                      Super Usuario
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm text-foreground">Proyectos</Label>
                    <p className="text-xs text-muted-foreground">Ver proyectos y cronogramas</p>
                  </div>
                  <Switch
                    checked={editedUser.canViewProjects}
                    onCheckedChange={(checked) => setEditedUser({ ...editedUser, canViewProjects: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm text-foreground">Cuenta</Label>
                    <p className="text-xs text-muted-foreground">Ver cuenta corriente y facturas</p>
                  </div>
                  <Switch
                    checked={editedUser.canViewAccount}
                    onCheckedChange={(checked) => setEditedUser({ ...editedUser, canViewAccount: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm text-foreground">Usuarios</Label>
                    <p className="text-xs text-muted-foreground">Gestionar usuarios de la empresa</p>
                  </div>
                  <Switch
                    checked={editedUser.canViewUsers}
                    onCheckedChange={(checked) => setEditedUser({ ...editedUser, canViewUsers: checked })}
                  />
                </div>
              </div>

              <Button onClick={handleSaveEdit} className="w-full bg-primary hover:bg-primary/90">
                <UserPlus className="h-4 w-4 mr-2" />
                Guardar Cambios
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialogo de eliminación */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-md bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Dar de Baja Usuario</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                ¿Estás seguro de que quieres dar de baja a este usuario?
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-foreground">Nombre Completo</Label>
                <Input
                  placeholder="Juan Pérez"
                  value={userToDelete?.name || ''}
                  readOnly
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Email</Label>
                <Input
                  type="email"
                  placeholder="juan@empresa.com"
                  value={userToDelete?.email || ''}
                  readOnly
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Teléfono</Label>
                <Input
                  type="tel"
                  placeholder="+54 911 1234-5678"
                  value={userToDelete?.phone || ''}
                  readOnly
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-3 p-4 bg-muted rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-semibold text-foreground">Permisos de Acceso</Label>
                  {userToDelete?.canViewProjects && userToDelete?.canViewAccount && userToDelete?.canViewUsers && (
                    <Badge className="bg-chart-5 text-white">
                      <Shield className="h-3 w-3 mr-1" />
                      Super Usuario
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm text-foreground">Proyectos</Label>
                    <p className="text-xs text-muted-foreground">Ver proyectos y cronogramas</p>
                  </div>
                  <Switch
                    checked={userToDelete?.canViewProjects !== false}
                    disabled
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm text-foreground">Cuenta</Label>
                    <p className="text-xs text-muted-foreground">Ver cuenta corriente y facturas</p>
                  </div>
                  <Switch
                    checked={userToDelete?.canViewAccount !== false}
                    disabled
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm text-foreground">Usuarios</Label>
                    <p className="text-xs text-muted-foreground">Gestionar usuarios de la empresa</p>
                  </div>
                  <Switch
                    checked={userToDelete?.canViewUsers !== false}
                    disabled
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="bg-red-500 hover:bg-red-600" onClick={confirmDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Dar de Baja
                </Button>
                <Button size="sm" className="bg-gray-500 hover:bg-gray-600" onClick={() => setIsDeleteDialogOpen(false)}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};