// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Wrapper } from './Wrapper';
import type { ReactNode } from 'react';

export const Body = ({ children }: { children: ReactNode }) => (
  <Wrapper>{children}</Wrapper>
);
