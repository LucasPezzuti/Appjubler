import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockInvoices } from '../../mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '../ui/tabs';
import { GalaxyBackground } from '../GalaxyBackground';
import { toast } from 'sonner';
import { 
  Download, 
  AlertCircle, 
  CheckCircle, 
  FileText, 
  DollarSign,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

export const AccountView: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('balance');
  
  const invoices = mockInvoices.filter(i => i.companyId === user?.companyId);
  
  // Mock movements data
  const movements = [
    {
      id: '1',
      date: '2024-01-15',
      description: 'Factura #001-2024',
      debit: 15000,
      credit: 0,
      balance: -15000
    },
    {
      id: '2',
      date: '2024-01-20',
      description: 'Pago recibido',
      debit: 0,
      credit: 10000,
      balance: -5000
    },
    {
      id: '3',
      date: '2024-01-25',
      description: 'Factura #002-2024',
      debit: 8000,
      credit: 0,
      balance: -13000
    }
  ];

  const currentBalance = movements.length > 0 ? movements[movements.length - 1].balance : 0;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-chart-4/20 text-chart-4 border-chart-4/30';
      case 'PENDING': return 'bg-chart-3/20 text-chart-3 border-chart-3/30';
      case 'OVERDUE': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PAID': return 'Pagada';
      case 'PENDING': return 'Pendiente';
      case 'OVERDUE': return 'Vencida';
      default: return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const handleDownloadInvoice = (invoiceNumber: string) => {
    toast.success(`Descargando factura ${invoiceNumber}...`);
  };

  return (
    <div className="h-full flex flex-col bg-background relative">
      {/* Galaxy Background */}
      <GalaxyBackground />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        <div className="p-4 border-b border-border bg-card/80 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-foreground">Cuenta Corriente</h2>
        </div>

        <div className="p-4 bg-gradient-to-br from-primary/80 to-primary text-white">
          <p className="text-sm opacity-90 mb-1">Saldo Actual</p>
          <p className="text-3xl font-bold">{formatCurrency(currentBalance)}</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2 m-4 bg-card border border-border">
            <TabsTrigger value="balance" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Movimientos
            </TabsTrigger>
            <TabsTrigger value="invoices" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Facturas
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="balance" className="h-full m-0">
              <div className="h-full overflow-auto p-4 space-y-3">
                {movements.map(movement => (
                  <Card key={movement.id} className="bg-card border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{movement.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(movement.date).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                        <div className="text-right">
                          {movement.debit > 0 && (
                            <p className="text-sm font-semibold text-destructive flex items-center">
                              <TrendingDown className="h-4 w-4 mr-1" />
                              -{formatCurrency(movement.debit)}
                            </p>
                          )}
                          {movement.credit > 0 && (
                            <p className="text-sm font-semibold text-chart-4 flex items-center">
                              <TrendingUp className="h-4 w-4 mr-1" />
                              +{formatCurrency(movement.credit)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <span className="text-xs text-muted-foreground">Saldo</span>
                        <span className="text-sm font-medium text-foreground">{formatCurrency(movement.balance)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="invoices" className="h-full m-0">
              <div className="h-full overflow-auto p-4 space-y-3">
                {invoices.map(invoice => (
                  <Card key={invoice.id} className="bg-card border-border">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base text-foreground flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            Factura {invoice.number}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {new Date(invoice.date).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                        <Badge variant="outline" className={getStatusColor(invoice.status)}>
                          {getStatusText(invoice.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Monto</span>
                          <span className="font-semibold text-foreground">{formatCurrency(invoice.amount)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Saldo</span>
                          <span className="font-semibold text-foreground">{formatCurrency(invoice.balance)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Vencimiento</span>
                          <span className="text-foreground">{new Date(invoice.dueDate).toLocaleDateString('es-ES')}</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full border-border hover:bg-secondary"
                        onClick={() => handleDownloadInvoice(invoice.number)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Descargar PDF
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};