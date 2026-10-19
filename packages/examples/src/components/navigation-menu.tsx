import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

const PRODUCTS = [
  ['Theme engine', 'Generate a contrast-safe theme from a few settings.'],
  ['Components', 'Sixty themed components on shadcn/ui and Radix.'],
  ['Agent kit', 'Skills that keep coding agents on-theme.'],
];

export default defineDoc({
  slug: 'navigation-menu',
  name: 'Navigation Menu',
  category: 'navigation',
  description: 'Site navigation with dropdown panels of links, for marketing sites and docs.',
  examples: [
    {
      name: 'Default',
      render: () => (
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Product</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-80 gap-1">
                  {PRODUCTS.map(([title, body]) => (
                    <li key={title}>
                      <NavigationMenuLink href={`#${title}`}>
                        <span className="font-medium">{title}</span>
                        <span className="text-muted-foreground">{body}</span>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="#docs" className={navigationMenuTriggerStyle()}>
                Docs
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="#pricing" className={navigationMenuTriggerStyle()}>
                Pricing
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      ),
    },
  ],
});
