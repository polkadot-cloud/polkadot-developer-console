// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types';
import type { InputNamespace } from 'contexts/ChainUi/types';
import type { InputCallbackProps } from 'library/Inputs/types';
import type { PalletScraper } from 'model/Scraper/Pallet';

// All supported input types.
export type InputType =
  | 'AccountId32'
  | 'Hash'
  | 'Bytes'
  | 'str'
  | 'bool'
  | 'variant'
  | 'composite'
  | 'compact'
  | 'sequence'
  | 'sequenceItem'
  | 'tuple';

// Input keys record structure.
export type InputMeta = Record<
  string,
  { inputType: InputType; indexKey: string }
>;

export interface InputArgConfig {
  activePallet: string | null;
  activeItem: string | null;
  scraper: PalletScraper;
  namespace: InputNamespace;
  inputMeta: InputMeta;
  inputKey: string;
}

export type SequenceProps = InputCallbackProps & {
  config: InputArgConfig;
  indexKey: string;
  arrayInput: AnyJson;
  maxLength?: number;
};
