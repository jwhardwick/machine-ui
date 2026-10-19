import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import { loadFonts } from './fonts.ts';
import { ComponentDetailPage } from './pages/component-detail.tsx';
import { ComponentsPage } from './pages/components.tsx';
import { GetStartedPage } from './pages/get-started.tsx';
import { HomePage } from './pages/home.tsx';
import { NotFoundPage } from './pages/not-found.tsx';
import { ScreensPage } from './pages/screens.tsx';
import { ThemesPage } from './pages/themes.tsx';
import { Shell } from './site/shell.tsx';
import { SiteThemeProvider } from './site/theme.tsx';
import './styles.css';

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
