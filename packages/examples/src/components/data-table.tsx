import { Badge, DataTable, DataTableColumnHeader, selectionColumn, type ColumnDef } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

interface Member {
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Member';
  lastActive: string;
}

const MEMBERS: Member[] = [
  { name: 'Ada Lovelace', email: 'ada@northwind.dev', role: 'Owner', lastActive: 'Today' },
  { name: 'Grace Hopper', email: 'grace@northwind.dev', role: 'Admin', lastActive: 'Today' },
  { name: 'Katherine Johnson', email: 'kj@northwind.dev', role: 'Member', lastActive: 'Yesterday' },
  { name: 'Margaret Hamilton', email: 'margaret@northwind.dev', role: 'Admin', lastActive: '3 days ago' },
  { name: 'Radia Perlman', email: 'radia@northwind.dev', role: 'Member', lastActive: 'Last week' },
  { name: 'Barbara Liskov', email: 'barbara@northwind.dev', role: 'Member', lastActive: 'Today' },
  { name: 'Frances Allen', email: 'frances@northwind.dev', role: 'Member', lastActive: '2 days ago' },
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
