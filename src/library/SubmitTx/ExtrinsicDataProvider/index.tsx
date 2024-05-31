// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';
import { createContext, useContext } from 'react';
import { defaultExtrinsicDataContext } from './defaults';
import type { ExtrinsicDataContextInterface } from './types';

export const ExtrinsicDataContext =
  createContext<ExtrinsicDataContextInterface>(defaultExtrinsicDataContext);

export const useExtrinsicData = () => useContext(ExtrinsicDataContext);

export const ExtrinsicDataProvider = ({
  instanceId,
  chainId,
  ss58Prefix,
  units,
  unit,
  children,
}: AnyJson) => (
  <ExtrinsicDataContext.Provider
    value={{
      instanceId,
      chainId,
      ss58Prefix,
      units,
      unit,
    }}
  >
    {children}
  </ExtrinsicDataContext.Provider>
);
