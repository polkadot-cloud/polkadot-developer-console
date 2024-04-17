// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PageWithMenu } from 'routes/Common/PageWithMenu';
import type { PageSections, RouteSectionProvider } from 'routes/Common/types';
import { Overview } from './Overview';
import { Extrinsics } from './Extrinsics';
import { ChainState } from './ChainState';
import { TabMenu } from '../../library/TabMenu';
import { PageContent } from 'library/PageContent';
import { Accounts } from './Accounts';
import { useActiveTabId } from 'contexts/ActiveTab';
import { useApi } from 'contexts/Api';

export const useRouteSections = (): RouteSectionProvider => {
  const { getChainSpec } = useApi();
  const activeTabId = useActiveTabId();
  const chainSpec = getChainSpec(activeTabId);

  const balancesPaleltExists = chainSpec?.metadata?.palletExists('Balances');

  const sections: PageSections = {
    0: {
      label: 'Overview',
      Component: Overview,
      pageWidth: 'wide',
    },
    1: {
      label: 'Chain State',
      Component: ChainState,
      pageWidth: 'wide',
    },
    2: {
      label: 'Extrinsics',
      Component: Extrinsics,
      pageWidth: 'wide',
    },
  };

  if (balancesPaleltExists) {
    sections[3] = {
      label: 'Accounts',
      Component: Accounts,
      pageWidth: 'wide',
    };
  }

  return { label: 'Chain', sections, pageWidth: 'thin' };
};

export const Chain = () => (
  <PageWithMenu
    route="default"
    Page={PageContent}
    Menu={TabMenu}
    routeProvider={useRouteSections}
  />
);
