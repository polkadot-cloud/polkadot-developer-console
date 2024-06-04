// Copyright 2024 @polkadot-cloud/developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PageWithMenu } from 'routes/Common/PageWithMenu';
import type { PageSections, RouteSectionProvider } from 'routes/Common/types';
import { TabMenu } from 'library/TabMenu';
import { Connect } from './Connect';
import { Parachain } from './Parachain';
import {
  faLayerPlus,
  faPlugCircleBolt,
} from '@fortawesome/pro-duotone-svg-icons';

export const useRouteSections = (): RouteSectionProvider => {
  const sections: PageSections = {
    0: {
      label: 'Connect',
      icon: faPlugCircleBolt,
      Component: Connect,
    },
    1: {
      label: 'New Parachain',
      icon: faLayerPlus,
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
