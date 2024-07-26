// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { Wrapper } from './Wrapper';
import type { ReactNode } from 'react';

export const Body = ({ children }: { children: ReactNode }) => (
  <Wrapper>{children}</Wrapper>
);
