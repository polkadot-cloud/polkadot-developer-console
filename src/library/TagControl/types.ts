// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { IconProps } from '@polkadot-cloud/icons';
import type { FC, MouseEvent as ReactMouseEvent } from 'react';

export interface TagControlProps {
  name: string;
  icon?: FC<IconProps>;
  large?: boolean;
  light?: boolean;
  onClick: (ev: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void;
}
