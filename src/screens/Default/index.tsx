// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useApi } from 'contexts/Api';
import { ConnectChain } from './ConnectChain';
import { ManageTab } from './ManageTab';
import { useSection } from 'library/Page/provider';

export const Default = () => {
  const { getTabApi } = useApi();
  const { activeSection } = useSection();

  // If Api instance does not yet exist for the tab, display the connect chain UI.
  const firstSection = getTabApi() ? (
    <h2>Chain Api Instnace present.</h2>
  ) : (
    <ConnectChain />
  );

  return (
    <>
      {activeSection === 0 && firstSection}
      {activeSection === 1 && <ManageTab />}
    </>
  );
};
