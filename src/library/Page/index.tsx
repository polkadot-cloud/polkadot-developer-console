// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Wrapper } from './Wrapper';
import type { ReactNode } from 'react';

export const Page = ({ children }: { children: ReactNode }) => (
  <Wrapper>{children}</Wrapper>
);
