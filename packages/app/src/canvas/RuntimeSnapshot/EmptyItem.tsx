// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { RuntimeItemWrapper } from 'canvas/Wrappers';
import type { EmptyItemProps } from './types';

export const EmptyItem = ({ text }: EmptyItemProps) => (
  <RuntimeItemWrapper>
    <h4>{text}</h4>
  </RuntimeItemWrapper>
);
