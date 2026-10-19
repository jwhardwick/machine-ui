import { toSrgb, type Oklch } from './oklch.ts';

function linear(channel: number): number {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

/** WCAG 2.x relative luminance. */
export function luminance(color: Oklch): number {
  const [r, g, b] = toSrgb(color);
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

export function wcagContrast(a: Oklch, b: Oklch): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** APCA-W3 0.1.9 lightness contrast (Lc). Positive for dark text on light, negative for light on dark. */
export function apcaContrast(text: Oklch, background: Oklch): number {
  const screenY = (color: Oklch) => {
    const [r, g, b] = toSrgb(color);
    return 0.2126729 * r ** 2.4 + 0.7151522 * g ** 2.4 + 0.072175 * b ** 2.4;
  };
  const softClamp = (y: number) => (y < 0.022 ? y + (0.022 - y) ** 1.414 : y);

  const yText = softClamp(screenY(text));
  const yBg = softClamp(screenY(background));
  if (Math.abs(yBg - yText) < 0.0005) return 0;

  if (yBg > yText) {
    const sapc = (yBg ** 0.56 - yText ** 0.57) * 1.14;
    return sapc < 0.1 ? 0 : (sapc - 0.027) * 100;
  }
  const sapc = (yBg ** 0.65 - yText ** 0.62) * 1.14;
  return sapc > -0.1 ? 0 : (sapc + 0.027) * 100;
}
