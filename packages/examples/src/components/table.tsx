import { Badge, Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

const INVOICES = [
  ['INV-2041', 'Paid', 'Card', '$1,250.00'],
  ['INV-2042', 'Pending', 'Bank transfer', '$480.00'],
  ['INV-2043', 'Overdue', 'Card', '$2,300.00'],
  ['INV-2044', 'Paid', 'Card', '$96.00'],
] as const;

export default defineDoc({
  slug: 'table',
  name: 'Table',
  category: 'data',
  description: 'Composable table parts for simple tabular data. Use Data Table when you need sorting or selection.',
  examples: [
    {
      name: 'Invoices',
      wide: true,
      render: () => (
        <Table className="max-w-2xl">
          <TableCaption>Invoices for October 2026.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {INVOICES.map(([id, status, method, amount]) => (
              <TableRow key={id}>
                <TableCell className="font-medium">{id}</TableCell>
                <TableCell>
                  <Badge variant={status === 'Overdue' ? 'destructive' : status === 'Paid' ? 'secondary' : 'outline'}>{status}</Badge>
                </TableCell>
                <TableCell>{method}</TableCell>
                <TableCell className="text-right tabular-nums">{amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right tabular-nums">$4,126.00</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      ),
    },
  ],
});
