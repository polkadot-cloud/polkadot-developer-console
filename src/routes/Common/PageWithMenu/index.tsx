// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Body } from 'library/Body';
import { RouteProvider } from 'contexts/Route';
import type { PageWithMenuProps } from './types';
import { NetworkDirectory, type DirectoryId } from 'config/networks';
import { accentColors } from 'styles/accents/developer-console';
import { useApi } from 'contexts/Api';
import { useSettings } from 'contexts/Settings';
import { PageWrapper } from 'library/PageContent/Wrappers';
import { useActiveTab } from 'contexts/ActiveTab';

// Renders a page and menu, with state controlling the active section of the page.
export const PageWithMenu = ({
  route,
  Page,
  Menu,
  routeProvider,
}: PageWithMenuProps) => {
  const { getApiStatus } = useApi();
  const routeConfig = routeProvider();
  const { tab, ownerId } = useActiveTab();
  const { chainColorEnabled } = useSettings();

  const apiStatus = getApiStatus(ownerId);

  // Get colors from active chain id.
  const chainId: DirectoryId | undefined =
    (tab?.chain?.id as DirectoryId) || undefined;

  const apiConnected = ['ready', 'connected', 'connecting'].includes(apiStatus);
  const networkColor = NetworkDirectory[chainId]?.color;

  // Get chain color, if present.
  const color =
    !apiConnected || !chainColorEnabled
      ? accentColors.primary.light
      : networkColor
        ? networkColor
        : accentColors.secondary.light;

  return (
    <div
      style={
        color
          ? Object.fromEntries([['--accent-color-secondary', color]])
          : undefined
      }
    >
      <RouteProvider route={route}>
        <Menu {...routeConfig} />
        <Body>
          <PageWrapper>
            <Page {...routeConfig} />
          </PageWrapper>
        </Body>
      </RouteProvider>
    </div>
  );
};
