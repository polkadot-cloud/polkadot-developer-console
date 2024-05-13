// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PageWithMenu } from 'routes/Common/PageWithMenu';
import type { PageSections, RouteSectionProvider } from 'routes/Common/types';
import { Overview } from './Overview';
import { Extrinsics } from './Extrinsics';
import { ChainState } from './ChainState';
import { TabMenu } from 'library/TabMenu';
import { Accounts } from './Accounts';
import { useActiveTab } from 'contexts/ActiveTab';
import {
  faDiagramSubtask,
  faInboxOut,
  faListTimeline,
  faTableLayout,
} from '@fortawesome/pro-duotone-svg-icons';
import { useChainSpaceEnv } from 'contexts/ChainSpaceEnv';
import { useApiIndexer } from 'contexts/ApiIndexer';
import { useChainExplorer } from 'contexts/ChainExplorer';
import { Preload } from './Preload';
import { ChainContext } from './Provider';

export const useRouteSections = (): RouteSectionProvider => {
  const { ownerId } = useActiveTab();
  const { getTabApiIndex } = useApiIndexer();
  const { getChainSpec } = useChainSpaceEnv();
  const { chainExplorerTaskIntegrityChecks } = useChainExplorer();

  const apiInstanceId = getTabApiIndex(ownerId, 'chainExplorer')?.instanceId;
  const chainSpec = getChainSpec(apiInstanceId);

  const balancesPaleltExists = chainSpec?.metadata?.palletExists('Balances');

  const sections: PageSections = {
    0: {
      label: 'Overview',
      icon: faTableLayout,
      Component: Overview,
      pageWidth: 'wide',
    },
    1: {
      label: 'Chain State',
      icon: faDiagramSubtask,
      Component: ChainState,
      pageWidth: 'wide',
    },
    2: {
      label: 'Extrinsics',
      icon: faInboxOut,
      Component: Extrinsics,
      pageWidth: 'wide',
    },
  };

  if (balancesPaleltExists) {
    sections[3] = {
      label: 'Accounts',
      icon: faListTimeline,
      Component: Accounts,
      pageWidth: 'wide',
    };
  }

  return {
    label: 'Chain',
    sections,
    pageWidth: 'wide',
    integrityCheck: {
      fn: chainExplorerTaskIntegrityChecks,
      Context: ChainContext,
      Preload,
    },
  };
};

export const Chain = () => (
  <PageWithMenu
    route="default"
    Menu={TabMenu}
    routeProvider={useRouteSections}
  />
);
