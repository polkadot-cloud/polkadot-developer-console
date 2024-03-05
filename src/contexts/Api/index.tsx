// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import { defaultApiContext } from './defaults';
import type { ApiContextInterface } from './types';

export const Api = createContext<ApiContextInterface>(defaultApiContext);

export const useApi = () => useContext(Api);

export const ApiProvider = ({ children }: { children: ReactNode }) => (
  <Api.Provider
    value={{
      isReady: false,
    }}
  >
    {children}
  </Api.Provider>
);
