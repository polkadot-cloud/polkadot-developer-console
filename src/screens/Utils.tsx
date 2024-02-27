// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Body } from 'library/Body';
import { Wrapper } from './Wrappers';
import type { ReactNode } from 'react';

export const pageWithMenu = (page: ReactNode, menu: ReactNode) => (
  <>
    {menu}
    <Body>
      <Wrapper>{page}</Wrapper>
    </Body>
  </>
);
