// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect } from 'react';
import type { UseRedirectProps } from './types';
import { useTabs } from 'contexts/Tabs';
import { useActiveTab } from 'contexts/ActiveTab';
import * as local from 'contexts/Tabs/Local';

export const useRedirect = ({ route }: UseRedirectProps) => {
  const { tabId } = useActiveTab();
  const { redirectCounter, setTabActivePage } = useTabs();

  // Handle redirects from local storage, if present.
  useEffect(() => {
    const redirectToPage = local.getPageRedirect(route, tabId);

    if (redirectToPage !== undefined) {
      setTabActivePage(tabId, route, redirectToPage, false);
    }
  }, [route, tabId, redirectCounter]);

  return;
};
