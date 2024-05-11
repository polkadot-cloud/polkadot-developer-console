// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Header } from './Header';
import { CustomEndpointInput } from './CustomEndpoint';
import { Directory } from './Directory';
import { useActiveTab } from 'contexts/ActiveTab';

export const Connect = () => {
  const { tab } = useActiveTab();
  const connectFrom = tab?.tabData?.connectFrom;

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
