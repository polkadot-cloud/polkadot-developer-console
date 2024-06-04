// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
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
  valid,
  transactionVersion,
  children,
}: ExtrinsicDataContextInterface & { children: ReactNode }) => (
  <ExtrinsicDataContext.Provider
    value={{
      instanceId,
      transactionVersion,
      chainId,
      ss58Prefix,
      units,
      unit,
      valid,
    }}
  >
    {children}
  </ExtrinsicDataContext.Provider>
);
