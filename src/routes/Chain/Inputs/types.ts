// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';
import type { InputNamespace } from 'contexts/ChainUi/types';
import type { InputCallbackProps } from 'library/Inputs/types';
import type { RefObject } from 'react';

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

export type InputArgConfig = InputCallbackProps & {
  inputKey: string;
  namespace: InputNamespace;
  inputKeysRef: RefObject<Record<string, string>>;
};

export type HashProps = InputArgConfig & {
  defaultValue: string | number;
};

export type SelectProps = InputCallbackProps & {
  values: string[];
  label: string | number;
  value: string;
};

export type CheckboxProps = InputArgConfig & {
  label: string | number;
  defaultValue: boolean;
};

export type SequenceProps = InputArgConfig & {
  type: string;
  arrayInput: AnyJson;
  maxLength?: number;
};
