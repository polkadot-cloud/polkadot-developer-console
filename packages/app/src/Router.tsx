// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { Navigate, Route, Routes } from 'react-router-dom';
import { Settings } from 'routes/Settings';
import { Chain } from 'routes/Chain';
import { useActiveTab } from 'contexts/ActiveTab';
import { useTabs } from 'contexts/Tabs';
import { useSetActivePage } from 'hooks/useSetActivePage';
import { ParachainSetup } from 'routes/ParachainSetup';
import { Default } from 'routes/Home';
import type { ReactNode } from 'react';
import { Splash } from 'routes/Splash';

export const Router = () => {
  const { tabId } = useActiveTab();
  const { getTabActiveTask } = useTabs();
  const tabActiveTask = getTabActiveTask(tabId);

  // on tab / location / task changes, check if a local active page exists for that route, and move
  // to that page if so.
  useSetActivePage();

  // Gets the active task component for the tab, or the default component otherwise.
  const getActiveTaskComponent = (): ReactNode => {
    // Fall back to splash page if active tab is 0 (no tab)
    if (tabId === 0) {
      return <Splash />;
    }

    switch (tabActiveTask) {
      case 'chainExplorer':
        return <Chain />;
      case 'parachainSetup':
        return <ParachainSetup />;
      default:
        return <Default />;
    }
  };

  return (
    <Routes>
      <Route
        key={`route_default`}
        path={'/'}
        element={getActiveTaskComponent()}
      />
      <Route key={`route_settings`} path={'/settings'} element={<Settings />} />
      {/* Fallback route to chain */}
      <Route key="route_fallback" path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
