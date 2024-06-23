// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { InputType } from 'routes/Chain/Inputs/types';

export interface CheckboxProps {
  label?: string | number;
  checked: boolean;
  onChange?: (val: boolean) => void;
  onMount?: (val: boolean) => void;
  onRender?: (inputType: InputType) => void;
}
