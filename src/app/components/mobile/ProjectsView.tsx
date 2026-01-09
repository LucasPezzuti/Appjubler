import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockProjects } from '../../mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { GalaxyBackground } from '../GalaxyBackground';
import { ExternalLink, Calendar, Users as UsersIcon } from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const { user } = useAuth();
  const projects = mockProjects.filter(p => p.companyId === user?.companyId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-chart-4/20 text-chart-4 border-chart-4/30';
      case 'COMPLETED': return 'bg-chart-1/20 text-chart-1 border-chart-1/30';
      case 'ON_HOLD': return 'bg-chart-3/20 text-chart-3 border-chart-3/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Activo';
      case 'COMPLETED': return 'Completado';
      case 'ON_HOLD': return 'En Espera';
      default: return status;
    }
  };

  return (
    <div className="h-full flex flex-col bg-background relative">
      {/* Galaxy Background */}
      <GalaxyBackground />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        <div className="p-4 border-b border-border bg-card/80 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-foreground">Proyectos</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {projects.length} proyecto{projects.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          {projects.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No tienes proyectos asignados</p>
            </div>
          ) : (
            projects.map(project => (
              <Card key={project.id} className="hover:shadow-md transition-shadow bg-card border-border">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base text-foreground">{project.name}</CardTitle>
                      <Badge variant="outline" className={`mt-2 ${getStatusColor(project.status)}`}>
                        {getStatusText(project.status)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                  <Button
                    variant="outline"
                    className="w-full border-border hover:bg-secondary"
                    onClick={() => window.open(project.scheduleUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver Cronograma
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};