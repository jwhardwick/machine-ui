import { Badge, DataTable, DataTableColumnHeader, selectionColumn, type ColumnDef } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

interface Member {
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Member';
  lastActive: string;
}

const MEMBERS: Member[] = [
  { name: 'Richard Hendricks', email: 'richard@machine-co.dev', role: 'Owner', lastActive: 'Today' },
  { name: 'Bertram Gilfoyle', email: 'gilfoyle@machine-co.dev', role: 'Admin', lastActive: 'Today' },
  { name: 'Dinesh Chugtai', email: 'dinesh@machine-co.dev', role: 'Member', lastActive: 'Yesterday' },
  { name: 'Monica Hall', email: 'monica@machine-co.dev', role: 'Admin', lastActive: '3 days ago' },
  { name: 'Erlich Bachman', email: 'erlich@machine-co.dev', role: 'Member', lastActive: 'Last week' },
  { name: 'Jared Dunn', email: 'jared@machine-co.dev', role: 'Member', lastActive: 'Today' },
  { name: 'Nelson Bighetti', email: 'bighead@machine-co.dev', role: 'Member', lastActive: '2 days ago' },
];

const columns: ColumnDef<Member>[] = [
  selectionColumn<Member>(),
  { accessorKey: 'name', header: ({ column }) => <DataTableColumnHeader column={column} title="Name" /> },
  { accessorKey: 'email', header: 'Email', cell: ({ getValue }) => <span className="text-muted-foreground">{getValue<string>()}</span> },
  {
    accessorKey: 'role',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
    cell: ({ getValue }) => <Badge variant={getValue() === 'Owner' ? 'default' : 'outline'}>{getValue<string>()}</Badge>,
  },
  { accessorKey: 'lastActive', header: 'Last active' },
];

export default defineDoc({
  slug: 'data-table',
  name: 'Data Table',
  category: 'data',
  description: 'A table with sorting, filtering, row selection, and pagination, built on TanStack Table.',
  examples: [
    {
      name: 'Members',
      wide: true,
      render: () => <DataTable className="max-w-3xl" columns={columns} data={MEMBERS} filterColumn="name" filterPlaceholder="Filter by name…" pageSize={5} />,
    },
  ],
});
