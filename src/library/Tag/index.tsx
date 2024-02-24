// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { TagWrapper } from './Wrapper';
import type { TagProps } from './types';

export const Tag = ({ name, large }: TagProps) => (
  <TagWrapper className={large ? 'large' : undefined}>{name}</TagWrapper>
);
