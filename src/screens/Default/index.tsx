// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useApi } from 'contexts/Api';
import { Connect } from './Connect';
import { ManageTab } from './ManageTab';
import { useSection } from 'library/Page/provider';
import { Overview } from './Overview';
import { ChainState } from './ChainState';
import { Extrinsics } from './Extrinsics';
import { useTabs } from 'contexts/Tabs';

export const Default = () => {
  const { getApiStatus } = useApi();
  const { activeTabId } = useTabs();
  const { activeSection } = useSection();
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
      {activeSection === 0 && firstSection}
      {activeSection === 1 && <ChainState />}
      {activeSection === 2 && <Extrinsics />}
      {activeSection === 3 && <ManageTab />}
    </>
  );
};
