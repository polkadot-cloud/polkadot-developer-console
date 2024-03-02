// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Body } from 'library/Body';
import { Page as PageWrapper } from 'library/Page';
import type { FC } from 'react';
import { useState } from 'react';

export interface PageProps {
  section: number;
  setSection: (section: number) => void;
}
export interface PageWithMenuProps {
  Page: FC<PageProps>;
  Menu: FC<PageProps>;
}

// Renders a page and menu, with state controlling the active section of the page.
export const PageWithMenu = ({ Page, Menu }: PageWithMenuProps) => {
  // The section section of the page.
  const [section, setSection] = useState<number>(0);

  return (
    <>
      <Menu section={section} setSection={setSection} />
      <Body>
        <PageWrapper>
          <Page section={section} setSection={setSection} />
        </PageWrapper>
      </Body>
    </>
  );
};
