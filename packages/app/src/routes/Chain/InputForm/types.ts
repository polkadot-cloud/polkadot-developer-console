// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { AnyJson } from '@w3ux/types';
import type { InputNamespace } from 'contexts/ChainUi/types';
import type { PalletScraper } from 'model/Scraper/Pallet';
import type { ReactNode } from 'react';
import type { InputMeta } from '../Inputs/types';

export interface InputFormContextInterface {
  namespace: InputNamespace;
  inputMeta: InputMeta;
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
  scraper: PalletScraper | null;
  fieldNames?: string[];
  onSubmit?: (inputs: AnyJson) => void;
}
