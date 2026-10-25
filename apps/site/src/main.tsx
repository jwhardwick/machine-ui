import { lazy, StrictMode, type ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import { loadFonts } from './fonts.ts';
import { HomePage } from './pages/home.tsx';
import { NotFoundPage } from './pages/not-found.tsx';
import { Shell } from './site/shell.tsx';
import { SiteThemeProvider } from './site/theme.tsx';
import './styles.css';

/** A page whose code loads when it's first visited. The home page stays in the entry chunk. */
const page = <K extends string>(load: () => Promise<Record<K, ComponentType>>, name: K) =>
  lazy(() => load().then((module) => ({ default: module[name] })));

const GetStartedPage = page(() => import('./pages/get-started.tsx'), 'GetStartedPage');
const ThemesPage = page(() => import('./pages/themes.tsx'), 'ThemesPage');
const ScreensPage = page(() => import('./pages/screens.tsx'), 'ScreensPage');
const ComponentsPage = page(() => import('./pages/components.tsx'), 'ComponentsPage');
const ComponentDetailPage = page(() => import('./pages/component-detail.tsx'), 'ComponentDetailPage');

// After a redeploy, an open tab can ask for chunks that no longer exist. Reload once to pick up the new build.
window.addEventListener('vite:preloadError', (event) => {
  try {
    if (sessionStorage.getItem('machine-ui:reloaded')) return;
    sessionStorage.setItem('machine-ui:reloaded', '1');
  } catch {
    return;
  }
  event.preventDefault();
  window.location.reload();
});

loadFonts();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SiteThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Shell />}>
            <Route index element={<HomePage />} />
            <Route path="get-started" element={<GetStartedPage />} />
            <Route path="themes" element={<ThemesPage />} />
            <Route path="screens" element={<ScreensPage />} />
            <Route path="components" element={<ComponentsPage />} />
            <Route path="components/:slug" element={<ComponentDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SiteThemeProvider>
  </StrictMode>,
);
