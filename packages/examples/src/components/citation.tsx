import { Citation, Sources } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

const SOURCES = [
  { title: 'Intercom thread #8812', url: 'https://app.intercom.example/t/8812', snippet: 'Customer reports sync stopped at 14:02 UTC.' },
  { title: 'Changelog v2.14', url: 'https://northwind.example/changelog/2-14', snippet: 'Sync interval moved to a server setting.' },
];

export default defineDoc({
  slug: 'citation',
  name: 'Citations',
  category: 'ai',
  description: 'Numbered markers in an answer that preview their source, and the list of sources underneath.',
  examples: [
    {
      name: 'Inline',
      wide: true,
      render: () => (
        <div className="grid max-w-xl gap-4 text-sm leading-relaxed">
          <p>
            Sync stopped at 14:02 UTC
            <Citation index={1} source={SOURCES[0]!} /> after the interval became a server setting in 2.14
            <Citation index={2} source={SOURCES[1]!} />.
          </p>
          <Sources sources={SOURCES} />
        </div>
      ),
    },
  ],
});
