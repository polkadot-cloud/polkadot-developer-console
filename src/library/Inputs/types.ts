// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { InputType } from 'routes/Chain/Inputs/types';

export interface InputCallbackProps {
  // Custom logic to execute when the component mounts. The initial input value is provided.
  onMount?: (val: string) => void;
  // Custom logic to execute when the value changes.
  onChange?: (val: string) => void;
  // Custom logic to execute when the component renders. The input type is provided.
  onRender?: (inputType: InputType) => void;
  // Custom logic to execute when component focuses.
  onFocus?: () => void;
}
