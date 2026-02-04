import { useTranslation } from 'react-i18next';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useInvoices } from '@/hooks/useAdminData';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  paid: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  overdue: 'bg-red-500/10 text-red-500 border-red-500/20',
  cancelled: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

export function InvoicesManagement() {
  const { t, i18n } = useTranslation();
  const { data: invoices, isLoading } = useInvoices();

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('admin.invoices.title')}</h1>
          <p className="text-muted-foreground">View and manage client invoices</p>
        </div>
      </div>

      {invoices && invoices.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.invoices.invoiceNumber')}</TableHead>
                  <TableHead>{t('admin.invoices.organization')}</TableHead>
                  <TableHead className="text-right">{t('admin.invoices.amount')}</TableHead>
                  <TableHead>{t('admin.invoices.status')}</TableHead>
                  <TableHead>{t('admin.invoices.dueDate')}</TableHead>
                  <TableHead>{t('admin.invoices.paidAt')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                    <TableCell>{invoice.organizations?.name || '-'}</TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat(i18n.language, {
                        style: 'currency',
                        currency: invoice.currency || 'PLN',
                      }).format(invoice.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[invoice.status] || ''} variant="outline">
                        {t(`admin.invoices.${invoice.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {invoice.due_date 
                        ? new Date(invoice.due_date).toLocaleDateString(i18n.language)
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {invoice.paid_at
                        ? new Date(invoice.paid_at).toLocaleDateString(i18n.language)
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">No invoices yet</p>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Invoices will appear here once clients make payments.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
