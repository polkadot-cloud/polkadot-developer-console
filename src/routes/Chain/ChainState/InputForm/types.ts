// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { InputArgsFor } from 'contexts/ChainUi/types';
import type { ReactNode, RefObject } from 'react';

export interface InputFormContextInterface {
  inputArgsFor: InputArgsFor;
  inputKeysRef: RefObject<Record<string, string>>;
}

export interface InputFormProviderProps {
  inputArgsFor: InputArgsFor;
  children: ReactNode;
}
