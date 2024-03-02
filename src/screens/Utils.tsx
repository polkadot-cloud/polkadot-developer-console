// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Body } from 'library/Body';
import { Wrapper } from './Wrappers';
import type { FC } from 'react';
import { useState } from 'react';

export interface PageProps {
  active: number;
  setActive: (active: number) => void;
}
export interface PageWithMenuProps {
  Page: FC<PageProps>;
  Menu: FC<PageProps>;
}

// Renders a page and menu, with state controlling the active section of the page.
export const PageWithMenu = ({ Page, Menu }: PageWithMenuProps) => {
  // The active section of the page.
  const [active, setActive] = useState<number>(0);

  return (
    <>
      <Menu active={active} setActive={setActive} />
      <Body>
        <Wrapper>
          <Page active={active} setActive={setActive} />
        </Wrapper>
      </Body>
    </>
  );
};
