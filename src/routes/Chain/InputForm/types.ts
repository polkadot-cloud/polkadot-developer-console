// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types';
import type { InputNamespace } from 'contexts/ChainUi/types';
import type { PalletScraper } from 'model/Scraper/Pallet';
import type { MutableRefObject, ReactNode } from 'react';
import type { InputMeta } from '../Inputs/types';

export interface InputFormContextInterface {
  namespace: InputNamespace;
  inputMetaRef: MutableRefObject<InputMeta>;
  handleSubmit: (onSubmit?: (inputArgs: AnyJson) => void) => AnyJson;
}

export interface InputFormProviderProps {
  namespace: InputNamespace;
  children: ReactNode;
  scraper: PalletScraper | null;
}

export interface InputFormInnerProps {
  argTypes: AnyJson;
  activePallet: string | null;
  activeItem: string | null;
  onSubmit?: (inputs: AnyJson) => void;
  scraper: PalletScraper | null;
}
