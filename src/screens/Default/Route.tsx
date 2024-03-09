// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ChainMenu } from './Menu';
import { Default } from '.';
import { PageWithMenu } from 'screens/Common/PageWithMenu';
import type { ScreenSections } from 'screens/types';
import { useApi } from 'contexts/Api';
import { useTabs } from 'contexts/Tabs';
import { Overview } from './Overview';
import { Extrinsics } from './Extrinsics';
import { ChainState } from './ChainState';

export const ScreenLabel = 'Settings';

export const useScreenSections = (): {
  label: string;
  sections: ScreenSections;
} => {
  const { activeTabId } = useTabs();
  const { getApiStatus, getApiActive } = useApi();
  const apiStatus = getApiStatus(activeTabId);
  const apiActive = getApiActive(activeTabId);

  // If Api status is not actively connecting or connected, route to Connect.
  const API_STATUSES = ['ready', 'connected', 'connecting'];

  // Determine screen sections based on Api status.
  const sections: ScreenSections = {
    0: API_STATUSES.includes(apiStatus)
      ? {
          label: 'Overview',
          Component: Overview,
        }
      : {
          label: 'Search Chain',
          Component: Default,
        },
  };

  if (apiActive) {
    sections[1] = {
      label: 'Chain State',
      Component: ChainState,
    };
    sections[2] = {
      label: 'Extrinsics',
      Component: Extrinsics,
    };
  }

  // Determine screen label based on Api status.
  let label;
  switch (apiStatus) {
    case 'connecting':
    case 'ready':
    case 'connected':
      label = 'Chain';
      break;
    default:
      label = 'Connect';
  }

  return { label, sections };
};

export const DefaultRoute = () => (
  <PageWithMenu pageId="default" Page={Default} Menu={ChainMenu} />
);
