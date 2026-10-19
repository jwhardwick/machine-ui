import { CURATED_FONT_FAMILIES } from '@machine-ui/tokens';

const PALETTE =
  'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';
const COLOR_UTILITY =
  'bg|text|border|border-[trblxy]|ring|ring-offset|fill|stroke|outline|shadow|decoration|accent|caret|divide|placeholder|from|via|to';

const BANNED_FONTS = ['Inter', 'Arial', 'Helvetica', 'Roboto', 'system-ui', 'Segoe UI', ...CURATED_FONT_FAMILIES];
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const CHECKS = [
  // Hex with a letter is a colour wherever it appears; all-digit hex (#8812) only in a colour position,
  // so issue and ticket numbers in copy don't trip the rule.
  [
    'rawColor',
    /#(?=[0-9]*[a-f])[0-9a-f]{3,8}\b|(?:^|[[(:,]\s*)#[0-9]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch|color)\(/i,
  ],
  ['rawPx', /\d*\.?\d+px\b/],
  ['paletteUtility', new RegExp(`(?:^|[\\s:])(?:${COLOR_UTILITY})-(?:(?:${PALETTE})-\\d{2,3}|white|black)\\b`)],
  ['gradient', /(?:^|[\s:])bg-(?:gradient|linear|radial|conic)-/],
  ['fontName', new RegExp(`(?:^|[^\\w-])(?:${BANNED_FONTS.map(escape).join('|')})(?![\\w-])`)],
];

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'problem',
    docs: { description: 'Allow only design tokens in component code: no raw colours, px values or font names.' },
    schema: [],
    messages: {
      rawColor: 'Raw colour value. Use a semantic colour token (e.g. bg-primary, var(--primary)).',
      rawPx: 'Raw px value. Use the spacing scale or a token (e.g. h-(--control-md)).',
      paletteUtility: "Tailwind palette colour. Use a semantic colour (e.g. 'bg-destructive', 'text-muted-foreground').",
      gradient: 'Gradients are off-system. Use flat semantic surfaces.',
      fontName: 'Font family name in component code. Use font-sans, font-display or font-mono.',
      rawStyleNumber: 'Numeric inline style. Use a token via a CSS variable or a utility class.',
    },
  },
  create(context) {
    const check = (node, text) => {
      for (const [messageId, pattern] of CHECKS) {
        if (pattern.test(text)) context.report({ node, messageId });
      }
    };
    const isModuleSource = (node) =>
      node.parent &&
      (node.parent.type === 'ImportDeclaration' ||
        node.parent.type === 'ExportNamedDeclaration' ||
        node.parent.type === 'ExportAllDeclaration' ||
        node.parent.type === 'ImportExpression');

    return {
      Literal(node) {
        if (typeof node.value === 'string' && !isModuleSource(node)) check(node, node.value);
      },
      TemplateElement(node) {
        check(node, node.value.cooked ?? node.value.raw);
      },
      JSXText(node) {
        check(node, node.value);
      },
      'JSXAttribute[name.name="style"] > JSXExpressionContainer > ObjectExpression > Property'(node) {
        if (node.value.type === 'Literal' && typeof node.value.value === 'number') {
          context.report({ node: node.value, messageId: 'rawStyleNumber' });
        }
      },
    };
  },
};
