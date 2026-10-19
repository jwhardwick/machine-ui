import { REFERENCE_THEMES } from '@machine-ui/tokens';
import { Button, Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue, Tooltip, TooltipContent, TooltipTrigger } from '@machine-ui/ui';
import { Check, Copy, Link2, Moon, SlidersHorizontal, Sun } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { installPrompt } from './install-prompt.ts';
import { useSiteTheme } from './theme.tsx';

function useCopied() {
  const [copied, setCopied] = useState(false);
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };
  return [copied, copy] as const;
}

/** A floating bar to switch theme and mode from anywhere, customise, share or copy the install prompt. */
export function ThemeToolbar() {
  const { seed, mode, setSeed, setMode, shareUrl } = useSiteTheme();
  const [promptCopied, copyPrompt] = useCopied();
  const [linkCopied, copyLink] = useCopied();
  const presetName = REFERENCE_THEMES.some((t) => t.name === seed.name) ? seed.name : 'custom';

  return (
    <div
      role="toolbar"
      aria-label="Theme"
      className="fixed bottom-4 left-1/2 z-40 flex max-w-[calc(100vw-1rem)] -translate-x-1/2 items-center gap-0.5 rounded-full border bg-popover p-1 text-popover-foreground shadow-lg sm:gap-1"
    >
      <Select
        value={presetName}
        onValueChange={(name) => {
          const next = REFERENCE_THEMES.find((t) => t.name === name);
          if (next) setSeed(next);
        }}
      >
        <SelectTrigger size="sm" aria-label="Theme preset" className="w-28 rounded-full border-transparent capitalize shadow-none sm:w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent side="top">
          {REFERENCE_THEMES.map((t) => (
            <SelectItem key={t.name} value={t.name} className="capitalize">
              {t.name}
            </SelectItem>
          ))}
          {presetName === 'custom' && (
            <>
              <SelectSeparator />
              <SelectItem value="custom">Custom</SelectItem>
            </>
          )}
        </SelectContent>
      </Select>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-(--control-sm) rounded-full"
            aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
          >
            {mode === 'dark' ? <Sun aria-hidden /> : <Moon aria-hidden />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{mode === 'dark' ? 'Light mode' : 'Dark mode'}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button asChild variant="ghost" size="icon" className="size-(--control-sm) rounded-full">
            <Link to="/themes" aria-label="Customise theme">
              <SlidersHorizontal aria-hidden />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Customise</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-(--control-sm) rounded-full"
            aria-label={linkCopied ? 'Link copied' : 'Copy link to this theme'}
            onClick={() => copyLink(shareUrl())}
          >
            {linkCopied ? <Check aria-hidden /> : <Link2 aria-hidden />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Share this theme</TooltipContent>
      </Tooltip>
      <Button
        size="sm"
        className="rounded-full"
        aria-label={promptCopied ? 'Install prompt copied' : 'Copy install prompt'}
        onClick={() => copyPrompt(installPrompt(seed))}
      >
        {promptCopied ? <Check aria-hidden /> : <Copy aria-hidden />}
        <span className="hidden sm:inline">{promptCopied ? 'Copied' : 'Copy install prompt'}</span>
        <span className="sm:hidden">{promptCopied ? 'Copied' : 'Prompt'}</span>
      </Button>
    </div>
  );
}
