// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Header } from './Header';
import { useTabs } from 'contexts/Tabs';
import { CustomEndpointInput } from './CustomEndpoint';
import { Directory } from './Directory';
import { useActiveTabId } from 'contexts/ActiveTab';

export const Connect = () => {
  const { getTab } = useTabs();
  const activeTabId = useActiveTabId();

  const tab = getTab(activeTabId);
  const connectFrom = tab?.connectFrom;

  return (
    <>
      <Header />
      {connectFrom === 'customEndpoint' ? (
        <CustomEndpointInput />
      ) : (
        <Directory />
      )}
    </>
  );
};
