// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { RuntimeItemWrapper } from 'canvas/Wrappers';
import type { EmptyItemProps } from './types';

export const EmptyItem = ({ text }: EmptyItemProps) => (
  <RuntimeItemWrapper>
    <h4>{text}</h4>
  </RuntimeItemWrapper>
);
