// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect } from 'react';
import type { UseRedirectProps } from './types';
import { useTabs } from 'contexts/Tabs';
import { useApi } from 'contexts/Api';
import { useActiveTab } from 'contexts/ActiveTab';
import * as local from 'contexts/Tabs/Local';

export const useRedirect = ({ route }: UseRedirectProps) => {
  const { getApiActive } = useApi();
  const { tabId, ownerId } = useActiveTab();
  const { redirectCounter, setTabActivePage } = useTabs();

  const apiActive = getApiActive(ownerId);

  // Handle redirects from local storage, if present.
  useEffect(() => {
    const redirect = local.getPageRedirect(route, tabId);

    if (redirect !== undefined) {
      setTabActivePage(tabId, route, redirect, apiActive, false);
    }
  }, [route, tabId, redirectCounter]);

  return;
};
