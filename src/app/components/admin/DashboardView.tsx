import React from 'react';
import { mockChats, mockTickets, mockCompanies } from '../../mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { GalaxyBackground } from '../GalaxyBackground';
import { 
  MessageSquare, 
  AlertCircle, 
  FileText,
  TrendingUp,
  Building2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export const DashboardView: React.FC = () => {
  // Calcular métricas
  const activeChats = mockChats.filter(c => c.status === 'ACTIVE').length;
  const openIncidents = mockTickets.filter(t => t.type === 'INCIDENT' && t.status !== 'CLOSED').length;
  const openRequirements = mockTickets.filter(t => t.type === 'REQUIREMENT' && t.status !== 'CLOSED').length;

  // Generar datos para los últimos 7 días
  const getLast7DaysData = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });
      
      // Simular datos aleatorios para demostración
      days.push({
        day: dayName,
        incidentes: Math.floor(Math.random() * 15) + 2,
        requerimientos: Math.floor(Math.random() * 10) + 1
      });
    }
    
    return days;
  };

  const weekData = getLast7DaysData();

  // Agrupar tickets por empresa
  const ticketsByCompany = mockCompanies.map(company => {
    const companyIncidents = mockTickets.filter(
      t => t.companyId === company.id && t.type === 'INCIDENT' && t.status !== 'CLOSED'
    );
    const companyRequirements = mockTickets.filter(
      t => t.companyId === company.id && t.type === 'REQUIREMENT' && t.status !== 'CLOSED'
    );

    return {
      company: company.name,
      incidents: companyIncidents.length,
      requirements: companyRequirements.length
    };
  }).filter(item => item.incidents > 0 || item.requirements > 0);

  return (
    <div className="h-full overflow-auto bg-background relative">
      {/* Galaxy Background */}
      <GalaxyBackground />
      
      {/* Content */}
      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
          <p className="text-muted-foreground">Resumen de actividad y métricas</p>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Chats Activos
              </CardTitle>
              <MessageSquare className="h-5 w-5 text-chart-1" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{activeChats}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Conversaciones en atención
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Incidentes Abiertos
              </CardTitle>
              <AlertCircle className="h-5 w-5 text-chart-6" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{openIncidents}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Requieren atención
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Requerimientos Abiertos
              </CardTitle>
              <FileText className="h-5 w-5 text-chart-2" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{openRequirements}</div>
              <p className="text-xs text-muted-foreground mt-1">
                En proceso
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Incidentes */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-chart-6" />
                Incidentes - Últimos 7 Días
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weekData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="day" 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Bar dataKey="incidentes" fill="hsl(var(--chart-6))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Requerimientos */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-chart-2" />
                Requerimientos - Últimos 7 Días
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={weekData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="day" 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="requerimientos" 
                    stroke="hsl(var(--chart-2))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--chart-2))', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tablas por cliente */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Incidentes por Cliente */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-chart-6" />
                Incidentes Abiertos por Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ticketsByCompany.filter(item => item.incidents > 0).length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay incidentes abiertos
                  </p>
                ) : (
                  ticketsByCompany
                    .filter(item => item.incidents > 0)
                    .sort((a, b) => b.incidents - a.incidents)
                    .map((item, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted border border-border hover:bg-secondary transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">
                            {item.company}
                          </span>
                        </div>
                        <Badge className="bg-chart-6/20 text-chart-6 border-chart-6/30">
                          {item.incidents} {item.incidents === 1 ? 'incidente' : 'incidentes'}
                        </Badge>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Requerimientos por Cliente */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <FileText className="h-5 w-5 text-chart-2" />
                Requerimientos Abiertos por Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ticketsByCompany.filter(item => item.requirements > 0).length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay requerimientos abiertos
                  </p>
                ) : (
                  ticketsByCompany
                    .filter(item => item.requirements > 0)
                    .sort((a, b) => b.requirements - a.requirements)
                    .map((item, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted border border-border hover:bg-secondary transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">
                            {item.company}
                          </span>
                        </div>
                        <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/30">
                          {item.requirements} {item.requirements === 1 ? 'requerimiento' : 'requerimientos'}
                        </Badge>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actividad reciente */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Resumen de Actividad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted rounded-lg border border-border">
                <div className="text-sm text-muted-foreground mb-1">Total de Clientes</div>
                <div className="text-2xl font-bold text-foreground">{mockCompanies.length}</div>
              </div>
              <div className="p-4 bg-muted rounded-lg border border-border">
                <div className="text-sm text-muted-foreground mb-1">Tickets Totales</div>
                <div className="text-2xl font-bold text-foreground">{mockTickets.length}</div>
              </div>
              <div className="p-4 bg-muted rounded-lg border border-border">
                <div className="text-sm text-muted-foreground mb-1">Conversaciones Totales</div>
                <div className="text-2xl font-bold text-foreground">{mockChats.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};