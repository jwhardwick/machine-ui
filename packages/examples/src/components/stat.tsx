import { Card, CardContent, Stat } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'stat',
  name: 'Stat',
  category: 'data',
  description: 'A labelled number with an optional change. Ups and downs show with an icon and text, not just colour.',
  examples: [
    {
      name: 'Row',
      wide: true,
      render: () => (
        <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <Stat label="Monthly revenue" value="$48.2k" change="12.4%" trend="up" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Stat label="Active users" value="3,912" change="4.1%" trend="up" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Stat label="Churn" value="2.1%" change="0.3pt" trend="down" />
            </CardContent>
          </Card>
        </div>
      ),
    },
  ],
});
