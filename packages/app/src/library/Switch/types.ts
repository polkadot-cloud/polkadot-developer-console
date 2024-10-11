// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { ComponentBaseWithClassName } from '@w3ux/types';

export type SwitchProps = ComponentBaseWithClassName & {
  scale?: number;
  active: boolean;
  disabled?: boolean;
  onSwitch?: (val: boolean) => void;
};
