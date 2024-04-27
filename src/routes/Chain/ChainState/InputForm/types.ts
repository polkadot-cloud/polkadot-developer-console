// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { InputArgsFor } from 'contexts/ChainUi/types';
import type { ReactNode } from 'react';

export interface InputFormContextInterface {
  inputArgsFor: InputArgsFor;
}

export interface InputFormProviderProps {
  inputArgsFor: InputArgsFor;
  children: ReactNode;
}
