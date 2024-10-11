// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { createContext, useContext } from 'react';
import type {
  IntegrityCheckedParachainContext,
  ParachainContextProps,
} from './types';
import { defaultParachainContextInterface } from './defaults';

export const ParachainProvider =
  createContext<IntegrityCheckedParachainContext>(
    defaultParachainContextInterface
  );

export const useParachain = () => useContext(ParachainProvider);

// Post-integrity checks provider for parachain setup task.
export const ParachainContext = ({
  children,
  ...rest
}: ParachainContextProps) => (
  <ParachainProvider.Provider value={rest}>
    {children}
  </ParachainProvider.Provider>
);
