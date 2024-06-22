// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types';
import type { InputNamespace } from 'contexts/ChainUi/types';
import type { InputCallbackProps } from 'library/Inputs/types';
import type { PalletScraper } from 'model/Scraper/Pallet';
import type { MutableRefObject } from 'react';

// All supported input types.
export type InputType =
  | 'AccountId32'
  | 'Hash'
  | 'Bytes'
  | 'Textbox'
  | 'Boolean'
  | 'Variant'
  | 'Composite'
  | 'Compact'
  | 'Sequence'
  | 'SequenceItem'
  | 'Tuple';

// Input keys record structure.
export type InputKeys = Record<
  string,
  { inputType: InputType; indexKey: string }
>;

export interface InputItem {
  form: AnyJson;
  label: string | number;
}

export interface InputArray extends InputItem {
  len: number;
}

export interface RenderInputArgs {
  inputItem: InputItem;
  key: string;
}

export interface InputArgConfig {
  activePallet: string | null;
  activeItem: string | null;
  scraper: PalletScraper;
  namespace: InputNamespace;
  inputKeysRef: MutableRefObject<InputKeys>;
  inputKey: string;
}

export type HashProps = InputArgConfig &
  InputCallbackProps & {
    value: string | number;
  };

export type SelectProps = InputCallbackProps & {
  values: string[];
  label: string | number;
  value: string;
};

export type CheckboxProps = InputArgConfig &
  InputCallbackProps & {
    label?: string | number;
    checked: boolean;
    onChange?: (val: boolean) => void;
    onMount?: (val: boolean) => void;
    onRender?: (inputType: InputType) => void;
  };

export type SequenceProps = InputCallbackProps & {
  config: InputArgConfig;
  indexKey: string;
  arrayInput: AnyJson;
  maxLength?: number;
};
