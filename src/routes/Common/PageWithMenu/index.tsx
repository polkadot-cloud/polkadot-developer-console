// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Body } from 'library/Body';
import { useRedirect } from 'hooks/useRedirect';
import type { PageWithMenuProps } from './types';
import type { DirectoryId } from 'config/networks/types';
import { accentColors } from 'styles/accents/developer-console';
import { useSettings } from 'contexts/Settings';
import { PageWrapper } from 'library/PageContent/Wrappers';
import { useActiveTab } from 'contexts/ActiveTab';
import { useTabs } from 'contexts/Tabs';
import { PageContent } from 'library/PageContent';
import { NetworkDirectory } from 'config/networks';
import { StickyMenu } from '../Wrappers';

// Renders a page and menu, with state controlling the active section of the page.
export const PageWithMenu = ({
  route,
  Menu,
  routeProvider,
}: PageWithMenuProps) => {
  const { tab } = useActiveTab();
  const routeConfig = routeProvider();
  const { getTabActiveTask } = useTabs();
  const { chainColorEnabled, tabsHidden } = useSettings();

  // Redirect when redirects are present in local storage.
  useRedirect({ route });

  const activeTask = tab?.id && getTabActiveTask(tab.id);

  // Get colors from active chain id.
  const chainId: DirectoryId | undefined =
    (tab?.taskData?.chain?.id as DirectoryId) || undefined;

  const networkColor = NetworkDirectory[chainId]?.color;

  // Get chain color, if present.
  const getChainColor = () =>
    activeTask !== 'chainExplorer' || !chainColorEnabled
      ? accentColors.primary.light
      : networkColor
        ? networkColor
        : accentColors.secondary.light;

  // Store active chain color.
  const chainColor = getChainColor();

  return (
    <div
      style={
        chainColor
          ? Object.fromEntries([['--accent-color-secondary', chainColor]])
          : undefined
      }
    >
      <StickyMenu className={tabsHidden ? 'tabsHidden' : ''}>
        <Menu {...routeConfig} />
      </StickyMenu>
      <Body>
        <PageWrapper>
          <PageContent {...routeConfig} />
        </PageWrapper>
      </Body>
    </div>
  );
};
