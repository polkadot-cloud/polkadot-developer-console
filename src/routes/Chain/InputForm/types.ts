// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types';
import type { InputNamespace } from 'contexts/ChainUi/types';
import type { MutableRefObject, ReactNode } from 'react';

export interface InputFormContextInterface {
  namespace: InputNamespace;
  inputKeysRef: MutableRefObject<Record<string, string>>;
  handleSubmit: (onSubmit?: (inputArgs: AnyJson) => void) => AnyJson;
}

export interface InputFormProviderProps {
  namespace: InputNamespace;
  children: ReactNode;
}

export interface InputFormInnerProps {
  inputForm: AnyJson;
  activePallet: string | null;
  activeItem: string | null;
  onSubmit?: (inputs: AnyJson) => void;
}
