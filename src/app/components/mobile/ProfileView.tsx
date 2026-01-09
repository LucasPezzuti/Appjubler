import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { GalaxyBackground } from '../GalaxyBackground';
import { User, Mail, Phone, Building2, Save, X, LogOut, Lock, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

export const ProfileView: React.FC = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [editedData, setEditedData] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSave = () => {
    // Aquí se guardarían los cambios en el backend
    toast.success('Perfil actualizado exitosamente');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData({
      name: user.name,
      phone: user.phone
    });
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    // Validaciones
    if (!passwordData.currentPassword) {
      toast.error('Ingresa tu contraseña actual');
      return;
    }

    if (!passwordData.newPassword) {
      toast.error('Ingresa tu nueva contraseña');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    // Aquí se haría la llamada al backend para cambiar la contraseña
    toast.success('Contraseña actualizada exitosamente');
    setIsPasswordDialogOpen(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const cancelPasswordChange = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setIsPasswordDialogOpen(false);
  };

  return (
    <div className="h-full bg-background overflow-auto relative">
      {/* Galaxy Background */}
      <GalaxyBackground />
      
      {/* Content */}
      <div className="relative z-10 p-6 max-w-2xl mx-auto space-y-6">
        {/* Header with Avatar */}
        <div className="text-center">
          <Avatar className="h-24 w-24 mx-auto mb-4">
            <AvatarFallback className="bg-primary/20 text-primary text-3xl">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>

        {/* Personal Information */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-foreground">Información Personal</CardTitle>
            {!isEditing && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="border-border hover:bg-secondary"
              >
                Editar
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Nombre Completo
              </Label>
              {isEditing ? (
                <Input
                  value={editedData.name}
                  onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                  className="bg-background border-border text-foreground"
                />
              ) : (
                <p className="text-foreground px-3 py-2 bg-muted rounded-md">{user.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email
              </Label>
              <p className="text-muted-foreground px-3 py-2 bg-muted rounded-md text-sm">
                {user.email}
                <span className="block text-xs mt-1">El email no puede ser modificado</span>
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                Teléfono
              </Label>
              {isEditing ? (
                <Input
                  value={editedData.phone}
                  onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                  className="bg-background border-border text-foreground"
                />
              ) : (
                <p className="text-foreground px-3 py-2 bg-muted rounded-md">{user.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                Empresa
              </Label>
              <p className="text-muted-foreground px-3 py-2 bg-muted rounded-md text-sm">
                {user.companyId}
                <span className="block text-xs mt-1">La empresa no puede ser modificada</span>
              </p>
            </div>

            {isEditing && (
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1 border-border hover:bg-secondary"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Change Password Button */}
        <Button
          onClick={() => setIsPasswordDialogOpen(true)}
          variant="outline"
          className="w-full"
        >
          <Lock className="h-4 w-4 mr-2" />
          Cambiar Contraseña
        </Button>

        {/* Logout Button */}
        <Button
          onClick={logout}
          variant="destructive"
          className="w-full"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar Sesión
        </Button>

        {/* Password Change Dialog */}
        <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Cambiar Contraseña</DialogTitle>
              <DialogDescription>
                Ingresa tu contraseña actual y tu nueva contraseña para cambiarla.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-foreground flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-muted-foreground" />
                  Contraseña Actual
                </Label>
                <Input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-muted-foreground" />
                  Nueva Contraseña
                </Label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-muted-foreground" />
                  Confirmar Nueva Contraseña
                </Label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="bg-background border-border text-foreground"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleChangePassword}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                <Save className="h-4 w-4 mr-2" />
                Guardar Cambios
              </Button>
              <Button
                onClick={cancelPasswordChange}
                variant="outline"
                className="flex-1 border-border hover:bg-secondary"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};