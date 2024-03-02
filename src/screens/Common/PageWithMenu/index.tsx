// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Body } from 'library/Body';
import { Page as PageWrapper } from 'library/Page';
import { SectionProvider } from 'library/Page/provider';
import type { PageWithMenuProps } from './types';

// Renders a page and menu, with state controlling the active section of the page.
export const PageWithMenu = ({ pageId, Page, Menu }: PageWithMenuProps) => (
  <SectionProvider pageId={pageId}>
    <Menu />
    <Body>
      <PageWrapper>
        <Page />
      </PageWrapper>
    </Body>
  </SectionProvider>
);
