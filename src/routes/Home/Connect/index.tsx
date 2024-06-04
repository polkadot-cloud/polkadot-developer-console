// Copyright 2024 @polkadot-cloud/developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Header } from './Header';
import { CustomEndpointInput } from './CustomEndpoint';
import { Directory } from './Directory';
import { useActiveTab } from 'contexts/ActiveTab';
import { HomePageWrapper } from '../Wrappers';

export const Connect = () => {
  const { tab } = useActiveTab();
  const connectFrom = tab?.ui.activeConnectFrom;

  return (
    <HomePageWrapper>
      <h2>Connect Chain </h2>
      <Header />
      {connectFrom === 'customEndpoint' ? (
        <CustomEndpointInput />
      ) : (
        <Directory />
      )}
    </HomePageWrapper>
  );
};
