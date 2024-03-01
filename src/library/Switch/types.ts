// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBaseWithClassName } from 'types';

export type SwitchProps = ComponentBaseWithClassName & {
  size?: 'sm' | 'lg';
  active: boolean;
  disabled?: boolean;
  onSwitch?: (val: boolean) => void;
};
