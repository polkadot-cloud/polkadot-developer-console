// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from 'types';
import { Wrapper } from './Wrapper';

export type EntryProps = ComponentBase & {
  mode: 'light' | 'dark';
  theme: string;
};

export const Entry = ({ children, style, mode, theme }: EntryProps) => (
  <Wrapper className={`theme-${mode} theme-${theme}`} style={style}>
    {children}
  </Wrapper>
);
