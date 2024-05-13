// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Navigate, Route, Routes } from 'react-router-dom';
import { Settings } from 'routes/Settings';
import { Chain } from 'routes/Chain';
import { useActiveTab } from 'contexts/ActiveTab';
import { useTabs } from 'contexts/Tabs';
import { useSetActivePage } from 'hooks/useSetActivePage';
import { ParachainSetup } from 'routes/ParachainSetup';
import { Default } from 'routes/Home';

export const Router = () => {
  const { tabId } = useActiveTab();
  const { getTabActiveTask } = useTabs();
  const tabActiveTask = getTabActiveTask(tabId);

  // on tab / location / task changes, check if a local active page exists for that route, and move
  // to that page if so.
  useSetActivePage();

  // Gets the active task component for the tab, or the default component otherwise.
  const getActiveTaskComponent = () => {
    switch (tabActiveTask) {
      case 'chainExplorer':
        return Chain;
      case 'parachainSetup':
        return ParachainSetup;
      default:
        return Default;
    }
  };

  // Active task to be rendered as the default route.
  const ActiveTask: () => JSX.Element = getActiveTaskComponent();

  return (
    <Routes>
      <Route key={`route_default`} path={'/'} element={<ActiveTask />} />
      <Route key={`route_settings`} path={'/settings'} element={<Settings />} />
      {/* Fallback route to chain */}
      <Route key="route_fallback" path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
