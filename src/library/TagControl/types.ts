// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import type { MouseEvent as ReactMouseEvent } from 'react';

export interface TagControlProps {
  name: string;
  icon?: IconProp;
  large?: boolean;
  light?: boolean;
  onClick: (ev: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void;
}
