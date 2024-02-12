// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { TabWrapper } from './Wrappers';
import type { TabProps } from './types';

export const Tab = ({ name, active }: TabProps) => (
  <TabWrapper className={active ? 'active' : undefined}>{name}</TabWrapper>
);
