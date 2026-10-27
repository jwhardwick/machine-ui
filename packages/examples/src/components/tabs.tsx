import { Tabs, TabsContent, TabsList, TabsTrigger } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'tabs',
  name: 'Tabs',
  category: 'navigation',
  description: 'Switches between views in the same context. Arrow keys move between tabs.',
  examples: [
    {
      name: 'Default',
      render: () => (
        <Tabs defaultValue="overview" className="w-full max-w-md">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="text-sm text-muted-foreground">
            42 agent sessions this week. 2 pull requests were reverted.
          </TabsContent>
          <TabsContent value="activity" className="text-sm text-muted-foreground">
            Nothing new since yesterday.
          </TabsContent>
          <TabsContent value="settings" className="text-sm text-muted-foreground">
            Notifications are on for failed runs.
          </TabsContent>
        </Tabs>
      ),
    },
  ],
});
