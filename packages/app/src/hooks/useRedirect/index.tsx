// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

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
