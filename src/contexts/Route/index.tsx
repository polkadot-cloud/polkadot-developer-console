// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createContext, useContext, useEffect, useState } from 'react';
import { defaultActivePage, defaultRouteContext } from './defaults';
import type { RouteContextInterface, RouteContextProps } from './types';
import * as local from './Local';
import { useTabs } from 'contexts/Tabs';
import { useApi } from 'contexts/Api';
import { useActiveTabId } from 'contexts/ActiveTab';

export const RouteContext =
  createContext<RouteContextInterface>(defaultRouteContext);

export const useRoute = () => useContext(RouteContext);

export const RouteProvider = ({ route, children }: RouteContextProps) => {
  const activeTabId = useActiveTabId();
  const { redirectCounter } = useTabs();
  const { getApiActive, getApiStatus } = useApi();

  const apiStatus = getApiStatus(activeTabId);
  const apiActive = getApiActive(activeTabId);

  // The active section of the page. Falls back to default section if not connected.
  const [activePage, setActivePageState] = useState<number>(
    !apiActive
      ? defaultActivePage
      : local.getActivePage(route, activeTabId) || defaultActivePage
  );

  // Sets active section, and updates local storage if persisted.
  const setActivePage = (section: number, persist = true) => {
    if (persist) {
      local.setActivePage(route, activeTabId, section);
    }
    setActivePageState(section);
  };

  // Handle redirects from local storage, if present. Also redirects back to default section if api
  // is not active.
  useEffect(() => {
    const redirect = local.getPageRedirect(route, activeTabId);
    const localActive = local.getActivePage(route, activeTabId);

    if (redirect) {
      setActivePage(redirect || localActive || defaultActivePage, false);
    } else {
      setActivePage(
        !apiActive ? defaultActivePage : localActive || defaultActivePage,
        false
      );
    }
  }, [route, activeTabId, redirectCounter, apiActive, apiStatus]);

  return (
    <RouteContext.Provider
      value={{
        activePage,
        setActivePage,
      }}
    >
      {children}
    </RouteContext.Provider>
  );
};
