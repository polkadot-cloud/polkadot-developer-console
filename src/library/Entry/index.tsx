// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { ComponentBase } from '@w3ux/types';
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
