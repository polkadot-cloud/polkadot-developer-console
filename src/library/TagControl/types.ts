// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import type { MouseEvent } from 'react';

export interface TagControlProps {
  name: string;
  icon?: IconProp;
  large?: boolean;
  onClick: (ev: MouseEvent) => void;
}
