import tokensOnly, { CHECKS } from './tokens-only.js';

export { CHECKS };

export default {
  meta: { name: '@machine-ui/eslint-plugin' },
  rules: { 'tokens-only': tokensOnly },
};
