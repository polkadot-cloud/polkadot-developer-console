// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Body } from 'library/Body';
import { useRedirect } from 'hooks/useRedirect';
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
  const { chainColorEnabled } = useSettings();
  const { tab, apiInstanceId } = useActiveTab();

  // Redirect when redirects are present in local storage.
  useRedirect({ route });

  const apiStatus = getApiStatus(apiInstanceId);

  // Get colors from active chain id.
  const chainId: DirectoryId | undefined =
    (tab?.tabData?.chain?.id as DirectoryId) || undefined;

  const apiConnected = ['ready', 'connected', 'connecting'].includes(apiStatus);
  const networkColor = NetworkDirectory[chainId]?.color;

  // Get chain color, if present.
  const getChainColor = () =>
    !apiConnected || !chainColorEnabled
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
          <Page {...routeConfig} />
        </PageWrapper>
      </Body>
    </div>
  );
};
