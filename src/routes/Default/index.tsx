// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useApi } from 'contexts/Api';
import { Connect } from './Connect';
import { ManageTab } from './ManageTab';
import { useRoute } from 'contexts/Route';
import { Overview } from './Overview';
import { ChainState } from './ChainState';
import { Extrinsics } from './Extrinsics';
import { useTabs } from 'contexts/Tabs';

export const Default = () => {
  const { getApiStatus } = useApi();
  const { activeTabId } = useTabs();
  const { activePage } = useRoute();
  const apiStatus = getApiStatus(activeTabId);

  // If `Api` instance does not yet exist for the tab, display the connect chain UI.
  const API_STATUSES = ['ready', 'connected', 'connecting'];
  const firstSection = API_STATUSES.includes(apiStatus) ? (
    <Overview />
  ) : (
    <Connect />
  );

  return (
    <>
      {activePage === 0 && firstSection}
      {activePage === 1 && <ChainState />}
      {activePage === 2 && <Extrinsics />}
      {activePage === 3 && <ManageTab />}
    </>
  );
};
