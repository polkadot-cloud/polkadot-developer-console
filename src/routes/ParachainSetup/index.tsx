// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PageWithMenu } from 'routes/Common/PageWithMenu';
import type { PageSections, RouteSectionProvider } from 'routes/Common/types';
import { TabMenu } from 'library/TabMenu';
import { faRectangleList } from '@fortawesome/pro-duotone-svg-icons';
import { SetupForm } from 'routes/ParachainSetup/SetupForm';

export const useRouteSections = (): RouteSectionProvider => {
  const sections: PageSections = {
    0: {
      label: 'Setup Form',
      icon: faRectangleList,
      Component: SetupForm,
      pageWidth: 'wide',
    },
  };

  return { label: 'Parachain', sections, pageWidth: 'wide' };
};

export const ParachainSetup = () => (
  <PageWithMenu
    route="default"
    Menu={TabMenu}
    routeProvider={useRouteSections}
  />
);
