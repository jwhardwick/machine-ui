import { Citation, Sources } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

const SOURCES = [
  { title: 'Issue #8812', url: 'https://github.com/machine-co/web/issues/8812', snippet: 'Hooli reports uploads over 2 GB fail since Tuesday.' },
  { title: 'Changelog v2.14', url: 'https://machine-co.example/changelog/2-14', snippet: 'Chunked uploads now need the middle-out flag.' },
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
            Uploads over 2 GB started failing for Hooli on Tuesday
            <Citation index={1} source={SOURCES[0]!} />, after 2.14 put chunked uploads behind a flag
            <Citation index={2} source={SOURCES[1]!} />.
          </p>
          <Sources sources={SOURCES} />
        </div>
      ),
    },
  ],
});
