import React, { useState, useEffect } from 'react';
import { AppShell, RouteId } from './components/AppShell';
import { MissionControlPage } from './pages/MissionControlPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectWorkspacePage } from './pages/ProjectWorkspacePage';
import { ProjectSetupPage } from './pages/ProjectSetupPage';
import { SuperResolutionPage } from './pages/SuperResolutionPage';
import { GeoAiPage } from './pages/GeoAiPage';
import { ChangeDetectionPage } from './pages/ChangeDetectionPage';
import { DomainIntelligencePage } from './pages/DomainIntelligencePage';
import { ReportsPage } from './pages/ReportsPage';

const routeToPath: Record<RouteId, string> = {
  'mission-control': '/',
  'projects': '/projects',
  'project-workspace': '/projects/urban-mumbai',
  'project-setup': '/projects/urban-mumbai/setup',
  'super-resolution': '/projects/urban-mumbai/super-resolution',
  'geoai': '/projects/urban-mumbai/geoai',
  'change-detection': '/projects/urban-mumbai/change-detection',
  'domain': '/projects/urban-mumbai/domain',
  'reports': '/projects/urban-mumbai/reports'
};

const pathToRoute: Record<string, RouteId> = Object.entries(routeToPath).reduce(
  (acc, [route, path]) => {
    acc[path] = route as RouteId;
    return acc;
  },
  {} as Record<string, RouteId>
);

export function App() {
  const [currentRoute, setCurrentRoute] = useState<RouteId>('mission-control');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Hash-based route synchronization
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || '/';
      if (pathToRoute[hash]) {
        setCurrentRoute(pathToRoute[hash]);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: RouteId) => {
    setCurrentRoute(route);
    const path = routeToPath[route];
    window.location.hash = path;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3200);
  };

  return (
    <AppShell 
      currentRoute={currentRoute} 
      onNavigate={navigateTo}
      toastMessage={toastMessage}
    >
      {currentRoute === 'mission-control' && (
        <MissionControlPage onNavigate={navigateTo} showToast={showToast} />
      )}
      {currentRoute === 'projects' && (
        <ProjectsPage onNavigate={navigateTo} showToast={showToast} />
      )}
      {currentRoute === 'project-workspace' && (
        <ProjectWorkspacePage onNavigate={navigateTo} showToast={showToast} />
      )}
      {currentRoute === 'project-setup' && (
        <ProjectSetupPage onNavigate={navigateTo} showToast={showToast} />
      )}
      {currentRoute === 'super-resolution' && (
        <SuperResolutionPage onNavigate={navigateTo} showToast={showToast} />
      )}
      {currentRoute === 'geoai' && (
        <GeoAiPage onNavigate={navigateTo} showToast={showToast} />
      )}
      {currentRoute === 'change-detection' && (
        <ChangeDetectionPage onNavigate={navigateTo} showToast={showToast} />
      )}
      {currentRoute === 'domain' && (
        <DomainIntelligencePage onNavigate={navigateTo} showToast={showToast} />
      )}
      {currentRoute === 'reports' && (
        <ReportsPage onNavigate={navigateTo} showToast={showToast} />
      )}
    </AppShell>
  );
}

export default App;
