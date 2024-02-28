// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import type { MouseEvent as ReactMouseEvent } from 'react';

export interface TagControlProps {
  name: string;
  icon?: IconProp;
  large?: boolean;
  light?: boolean;
  onClick: (ev: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void;
}
