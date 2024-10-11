// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { PageWithMenu } from 'routes/Common/PageWithMenu';
import type { PageSections, RouteSectionProvider } from 'routes/Common/types';
import { TabMenu } from 'library/TabMenu';
import { Connect } from './Connect';
import { Parachain } from './Parachain';
import {
  iconLayerPlus,
  iconPlugCircleBolt,
} from '@polkadot-cloud/icons/duotone';

export const useRouteSections = (): RouteSectionProvider => {
  const sections: PageSections = {
    0: {
      label: 'Connect',
      icon: iconPlugCircleBolt,
      Component: Connect,
    },
    1: {
      label: 'New Parachain',
      icon: iconLayerPlus,
      Component: Parachain,
    },
    // Coretime tab is disabled until more iterations are made with chain spaces.
    // 2: {
    //   label: 'Coretime',
    //   icon: faMicrochip,
    //   Component: Coretime,
    //   pageWidth: 'wide',
    // },
  };

  return { label: 'Home', sections, pageWidth: 'thin' };
};

export const Default = () => (
  <PageWithMenu
    route="default"
    routeProvider={useRouteSections}
    Menu={TabMenu}
  />
);
