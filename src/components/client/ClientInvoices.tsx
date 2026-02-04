import { useTranslation } from 'react-i18next';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { useClientData } from '@/hooks/useClientData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-700 border-amber-200',
  paid: 'bg-green-500/10 text-green-700 border-green-200',
  overdue: 'bg-red-500/10 text-red-700 border-red-200',
  cancelled: 'bg-gray-500/10 text-gray-700 border-gray-200',
};

export function ClientInvoices() {
  const { t } = useTranslation();
  const { invoices, loading } = useClientData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const formatCurrency = (amount: number, currency: string = 'PLN') => {
    return new Intl.NumberFormat('pl-PL', { style: 'currency', currency }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          {t('client.nav.invoices')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t('client.invoices.subtitle')}
        </p>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('client.invoices.list')}</CardTitle>
          <CardDescription>
            {t('client.invoices.totalCount', { count: invoices.length })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.invoices.invoiceNumber')}</TableHead>
                <TableHead>{t('client.invoices.period')}</TableHead>
                <TableHead>{t('admin.invoices.amount')}</TableHead>
                <TableHead>{t('admin.invoices.dueDate')}</TableHead>
                <TableHead>{t('admin.invoices.status')}</TableHead>
                <TableHead className="w-[100px]">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    {t('client.invoices.noInvoices')}
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">
                      {invoice.invoice_number}
                    </TableCell>
                    <TableCell>
                      {invoice.billing_period_start && invoice.billing_period_end ? (
                        <span className="text-sm">
                          {format(new Date(invoice.billing_period_start), 'MMM yyyy')}
                        </span>
                      ) : '-'}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(invoice.amount, invoice.currency || 'PLN')}
                    </TableCell>
                    <TableCell>
                      {invoice.due_date 
                        ? format(new Date(invoice.due_date), 'dd MMM yyyy')
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={statusColors[invoice.status || 'pending']}
                      >
                        {t(`admin.invoices.${invoice.status || 'pending'}`)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {invoice.pdf_url && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={invoice.pdf_url} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4 mr-1" />
                            PDF
                          </a>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
