// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Body } from 'library/Body';
import { Page as PageWrapper } from 'library/Page';
import { SectionProvider } from 'library/Page/provider';
import type { PageWithMenuProps } from './types';
import { NetworkDirectory, type DirectoryId } from 'config/networks';
import { useTabs } from 'contexts/Tabs';

// Renders a page and menu, with state controlling the active section of the page.
export const PageWithMenu = ({ pageId, Page, Menu }: PageWithMenuProps) => {
  const { getActiveTab } = useTabs();
  const tab = getActiveTab();

  // Get colors from active chain id.
  const chainId: DirectoryId | undefined =
    (tab?.chain?.id as DirectoryId) || undefined;

  // Get chain color, if present.
  const color = NetworkDirectory[chainId]?.color;

  return (
    <div
      style={
        color
          ? Object.fromEntries([['--accent-color-secondary', color]])
          : undefined
      }
    >
      <SectionProvider pageId={pageId}>
        <Menu />
        <Body>
          <PageWrapper>
            <Page />
          </PageWrapper>
        </Body>
      </SectionProvider>
    </div>
  );
};
