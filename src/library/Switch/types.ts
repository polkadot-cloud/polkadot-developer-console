// Copyright 2024 @polkadot-cloud/developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBaseWithClassName } from 'types';

export type SwitchProps = ComponentBaseWithClassName & {
  scale?: number;
  active: boolean;
  disabled?: boolean;
  onSwitch?: (val: boolean) => void;
};
