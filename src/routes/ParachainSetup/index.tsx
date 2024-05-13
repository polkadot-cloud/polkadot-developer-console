// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PageWithMenu } from 'routes/Common/PageWithMenu';
import type { PageSections, RouteSectionProvider } from 'routes/Common/types';
import { TabMenu } from 'library/TabMenu';
import { PageContent } from 'library/PageContent';
import { faLayerPlus } from '@fortawesome/pro-duotone-svg-icons';
import { SetupForm } from 'routes/ParachainSetup/SetupForm';

export const useRouteSections = (): RouteSectionProvider => {
  const sections: PageSections = {
    0: {
      label: 'Parachain Setup',
      icon: faLayerPlus,
      Component: SetupForm,
      pageWidth: 'wide',
    },
  };

  return { label: 'Parachain Setup', sections, pageWidth: 'wide' };
};

export const ParachainSetup = () => (
  <PageWithMenu
    route="default"
    Page={PageContent}
    Menu={TabMenu}
    routeProvider={useRouteSections}
  />
);
