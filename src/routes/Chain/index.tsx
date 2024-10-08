// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { PageWithMenu } from 'routes/Common/PageWithMenu';
import type { PageSections, RouteSectionProvider } from 'routes/Common/types';
import { Overview } from './Overview';
import { Extrinsics } from './Extrinsics';
import { ChainState } from './ChainState';
import { TabMenu } from 'library/TabMenu';
import { Accounts } from './Accounts';
import { useActiveTab } from 'contexts/ActiveTab';
import {
  iconDiagramSubtask,
  iconInboxOut,
  iconListTimeline,
  iconTableLayout,
} from '@polkadot-cloud/icons/duotone';
import { useChainSpaceEnv } from 'contexts/ChainSpaceEnv';
import { useApiIndexer } from 'contexts/ApiIndexer';
import { useChainExplorer } from 'contexts/ChainExplorer';
import { Preload } from './Preload';
import { ChainContext } from './Provider';

export const useRouteSections = (): RouteSectionProvider => {
  const { ownerId } = useActiveTab();
  const { getTabApiIndex } = useApiIndexer();
  const { getChainSpec } = useChainSpaceEnv();
  const { chainExplorerIntegrityCheck } = useChainExplorer();

  const instanceId = getTabApiIndex(ownerId, 'chainExplorer')?.instanceId;
  const chainSpec = getChainSpec(instanceId);

  const balancesPaleltExists = chainSpec?.metadata?.palletExists('Balances');

  const sections: PageSections = {
    0: {
      label: 'Overview',
      icon: iconTableLayout,
      Component: Overview,
      pageWidth: 'wide',
    },
    1: {
      label: 'Chain State',
      icon: iconDiagramSubtask,
      Component: ChainState,
      pageWidth: 'wide',
    },
    2: {
      label: 'Extrinsics',
      icon: iconInboxOut,
      Component: Extrinsics,
      pageWidth: 'wide',
    },
  };

  if (balancesPaleltExists) {
    sections[3] = {
      label: 'Accounts',
      icon: iconListTimeline,
      Component: Accounts,
      pageWidth: 'wide',
    };
  }

  return {
    label: 'Chain',
    sections,
    pageWidth: 'wide',
    integrityCheck: {
      fn: chainExplorerIntegrityCheck,
      Context: ChainContext,
      preloadWidth: 'wide',
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
