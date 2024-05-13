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
import { useChainExplorer } from 'contexts/ChainExplorer';
import type { ReactNode } from 'react';
import { ChainContext } from 'routes/Chain/Provider';

export const Router = () => {
  const { tabId } = useActiveTab();
  const { getTabActiveTask } = useTabs();
  const tabActiveTask = getTabActiveTask(tabId);
  const { chainExplorerTaskIntegrityChecks } = useChainExplorer();

  // on tab / location / task changes, check if a local active page exists for that route, and move
  // to that page if so.
  useSetActivePage();

  // Gets the active task component for the tab, or the default component otherwise.
  //
  // The active task component is only rendered if the task integrity checks pass. The result of the
  // integrity checks is passed to the task provider to prevent child components from having to
  // check for undefined values and general data integrity checks.
  const getActiveTaskComponent = (): ReactNode => {
    if (tabActiveTask === 'chainExplorer') {
      const integrityCheckResult = chainExplorerTaskIntegrityChecks(tabId);
      if (integrityCheckResult !== false) {
        return (
          <ChainContext {...integrityCheckResult}>
            <Chain />
          </ChainContext>
        );
      }
    }

    if (tabActiveTask === 'parachainSetup') {
      // TODO: Integrity checks.
      return <ParachainSetup />;
    }
    return <Default />;
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
