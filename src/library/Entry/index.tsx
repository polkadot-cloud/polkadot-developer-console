// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from 'types';
import { Wrapper } from './Wrapper';

export type EntryProps = ComponentBase & {
  mode: 'light' | 'dark';
  accent: string;
};

export const Entry = ({ children, style, mode, accent }: EntryProps) => (
  <Wrapper className={`theme-${mode} accent-${accent}`} style={style}>
    {children}
  </Wrapper>
);
