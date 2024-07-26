// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { PageWithMenu } from 'routes/Common/PageWithMenu';
import type { PageSections, RouteSectionProvider } from 'routes/Common/types';
import { TabMenu } from 'library/TabMenu';
import {
  faListTimeline,
  faRectangleList,
} from '@fortawesome/pro-duotone-svg-icons';
import { SetupForm } from 'routes/ParachainSetup/SetupForm';
import { useParaSetup } from 'contexts/ParaSetup';
import { ParachainContext } from './Provider';
import { Preload } from './Preload';
import { useChainSpaceEnv } from 'contexts/ChainSpaceEnv';
import { useApiIndexer } from 'contexts/ApiIndexer';
import { useActiveTab } from 'contexts/ActiveTab';
import { Accounts } from './Accounts';

export const useRouteSections = (): RouteSectionProvider => {
  const { ownerId } = useActiveTab();
  const { getTabApiIndex } = useApiIndexer();
  const { getChainSpec } = useChainSpaceEnv();

  const instanceId = getTabApiIndex(ownerId, 'parachainSetup')?.instanceId;
  const chainSpec = getChainSpec(instanceId);

  const balancesPaleltExists = chainSpec?.metadata?.palletExists('Balances');

  const { setupParachainIntegrityCheck } = useParaSetup();

  const sections: PageSections = {
    0: {
      label: 'Setup Form',
      icon: faRectangleList,
      Component: SetupForm,
      pageWidth: 'wide',
    },
  };

  if (balancesPaleltExists) {
    sections[1] = {
      label: 'Accounts',
      icon: faListTimeline,
      Component: Accounts,
      pageWidth: 'wide',
    };
  }

  return {
    label: 'Parachain',
    sections,
    pageWidth: 'wide',
    integrityCheck: {
      fn: setupParachainIntegrityCheck,
      Context: ParachainContext,
      preloadWidth: 'wide',
      Preload,
    },
  };
};

export const ParachainSetup = () => (
  <PageWithMenu
    route="default"
    Menu={TabMenu}
    routeProvider={useRouteSections}
  />
);
