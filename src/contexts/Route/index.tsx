// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createContext, useContext, useEffect } from 'react';
import { defaultActivePage } from './defaults';
import type { RouteContextProps } from './types';
import { useTabs } from 'contexts/Tabs';
import { useApi } from 'contexts/Api';
import { useActiveTab } from 'contexts/ActiveTab';
import type { AnyJson } from '@w3ux/utils/types';
import * as local from 'contexts/Tabs/Local';

export const RouteContext = createContext<AnyJson>({});

export const useRoute = () => useContext(RouteContext);

export const RouteProvider = ({ route, children }: RouteContextProps) => {
  const { tabId, ownerId } = useActiveTab();
  const { getApiActive, getApiStatus } = useApi();
  const { redirectCounter, setTabActivePage } = useTabs();

  const apiStatus = getApiStatus(ownerId);
  const apiActive = getApiActive(ownerId);

  // Sets active section, and updates local storage if persisted.
  const setActivePage = (page: number, persist = true) => {
    setTabActivePage(tabId, route, page, apiActive, persist);
  };

  // Handle redirects from local storage, if present. Also redirects back to default section if api
  // is not active.
  useEffect(() => {
    const redirect = local.getPageRedirect(route, tabId);
    const localActive = local.getActivePage(route, tabId, apiActive);

    if (redirect) {
      setActivePage(redirect || localActive || defaultActivePage, false);
    } else {
      setActivePage(localActive || defaultActivePage, false);
    }
  }, [route, tabId, redirectCounter, apiActive, apiStatus]);

  return <RouteContext.Provider value={{}}>{children}</RouteContext.Provider>;
};
