// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { TagWrapper } from './Wrapper';
import type { TagProps } from './types';

export const Tag = ({ name, large }: TagProps) => (
  <TagWrapper className={large ? 'large' : undefined}>{name}</TagWrapper>
);
