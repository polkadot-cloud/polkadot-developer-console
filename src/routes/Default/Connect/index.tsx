// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Header } from './Header';
import { useTabs } from 'contexts/Tabs';
import { CustomEndpointInput } from './CustomEndpoint';
import { Directory } from './Directory';

export const Connect = () => {
  const { getActiveTab } = useTabs();
  const tab = getActiveTab();
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
