// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Body } from 'library/Body';
import { useRedirect } from 'hooks/useRedirect';
import type { PageWithMenuProps } from './types';
import { NetworkDirectory, type DirectoryId } from 'config/networks';
import { accentColors } from 'styles/accents/developer-console';
import { useSettings } from 'contexts/Settings';
import { PageWrapper } from 'library/PageContent/Wrappers';
import { useActiveTab } from 'contexts/ActiveTab';
import { useChainSpaceEnv } from 'contexts/ChainSpaceEnv';
import { useTabs } from 'contexts/Tabs';
import { useApiIndexer } from 'contexts/ApiIndexer';
import { PageContent } from 'library/PageContent';

// Renders a page and menu, with state controlling the active section of the page.
export const PageWithMenu = ({
  route,
  Menu,
  routeProvider,
}: PageWithMenuProps) => {
  const routeConfig = routeProvider();
  const { getTabActiveTask } = useTabs();
  const { tab, ownerId } = useActiveTab();
  const { getTabApiIndex } = useApiIndexer();
  const { chainColorEnabled } = useSettings();
  const { getApiStatus } = useChainSpaceEnv();

  // Redirect when redirects are present in local storage.
  useRedirect({ route });

  const apiInstanceId = getTabApiIndex(ownerId, 'chainExplorer')?.instanceId;
  const activeTask = tab?.id && getTabActiveTask(tab.id);
  const apiStatus = getApiStatus(apiInstanceId);

  // Get colors from active chain id.
  const chainId: DirectoryId | undefined =
    (tab?.taskData?.chain?.id as DirectoryId) || undefined;

  const apiConnected = ['ready', 'connected', 'connecting'].includes(apiStatus);
  const networkColor = NetworkDirectory[chainId]?.color;

  // Get chain color, if present.
  const getChainColor = () =>
    activeTask !== 'chainExplorer' || !apiConnected || !chainColorEnabled
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
      <Menu {...routeConfig} />
      <Body>
        <PageWrapper>
          <PageContent {...routeConfig} />
        </PageWrapper>
      </Body>
    </div>
  );
};
