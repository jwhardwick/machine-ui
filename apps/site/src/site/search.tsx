import { COMPONENT_DOCS, SCREENS } from '@machine-ui/examples';
import { REFERENCE_THEMES } from '@machine-ui/tokens';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@machine-ui/ui';
import { Component, FileText, LayoutTemplate, Palette } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSiteTheme } from './theme.tsx';

const PAGES = [
  ['Overview', '/'],
  ['Get started', '/get-started'],
  ['Themes', '/themes'],
  ['Screens', '/screens'],
  ['All components', '/components'],
] as const;

/** ⌘K search across pages, components, screens and themes. */
export function SearchCommand({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const navigate = useNavigate();
  const { setSeed } = useSiteTheme();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onOpenChange]);

  const go = (to: string) => {
    onOpenChange(false);
    navigate(to);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Search" description="Search pages, components, screens and themes.">
      <CommandInput placeholder="Search components, screens, themes…" />
      <CommandList>
        <CommandEmpty>Nothing matches. Try a component name like “select”.</CommandEmpty>
        <CommandGroup heading="Pages">
          {PAGES.map(([label, to]) => (
            <CommandItem key={to} onSelect={() => go(to)}>
              <FileText aria-hidden /> {label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Components">
          {COMPONENT_DOCS.map((doc) => (
            <CommandItem key={doc.slug} value={`${doc.name} ${doc.description}`} onSelect={() => go(`/components/${doc.slug}`)}>
              <Component aria-hidden /> {doc.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Screens">
          {SCREENS.map((screen) => (
            <CommandItem key={screen.slug} onSelect={() => go(`/screens#${screen.slug}`)}>
              <LayoutTemplate aria-hidden /> {screen.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Themes">
          {REFERENCE_THEMES.map((seed) => (
            <CommandItem
              key={seed.name}
              value={`theme ${seed.name}`}
              onSelect={() => {
                setSeed(seed);
                onOpenChange(false);
              }}
            >
              <Palette aria-hidden /> Use {seed.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
