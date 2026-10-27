import { Badge, Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

const RUNS = [
  ['Run 1041', 'Passed', 'Push', '4m 12s'],
  ['Run 1042', 'Running', 'Agent', '1m 03s'],
  ['Run 1043', 'Failed', 'Schedule', '7m 48s'],
  ['Run 1044', 'Passed', 'Pull request', '3m 30s'],
] as const;

export default defineDoc({
  slug: 'table',
  name: 'Table',
  category: 'data',
  description: 'Composable table parts for simple tabular data. Use Data Table when you need sorting or selection.',
  examples: [
    {
      name: 'CI runs',
      wide: true,
      render: () => (
        <Table className="max-w-2xl">
          <TableCaption>CI runs on fix/upload-race.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Run</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Trigger</TableHead>
              <TableHead className="text-right">Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {RUNS.map(([id, status, trigger, duration]) => (
              <TableRow key={id}>
                <TableCell className="font-medium">{id}</TableCell>
                <TableCell>
                  <Badge variant={status === 'Failed' ? 'destructive' : status === 'Passed' ? 'secondary' : 'outline'}>{status}</Badge>
                </TableCell>
                <TableCell>{trigger}</TableCell>
                <TableCell className="text-right tabular-nums">{duration}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right tabular-nums">16m 33s</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      ),
    },
  ],
});
