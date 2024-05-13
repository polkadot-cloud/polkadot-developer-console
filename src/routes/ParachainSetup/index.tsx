// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PageWithMenu } from 'routes/Common/PageWithMenu';
import type { PageSections, RouteSectionProvider } from 'routes/Common/types';
import { TabMenu } from 'library/TabMenu';
import { faRectangleList } from '@fortawesome/pro-duotone-svg-icons';
import { SetupForm } from 'routes/ParachainSetup/SetupForm';
import { useParaSetup } from 'contexts/ParaSetup';
import { ParachainContext } from './Provider';
import { Preload } from './Preload';

export const useRouteSections = (): RouteSectionProvider => {
  const { setupParachainIntegrityCheck } = useParaSetup();

  const sections: PageSections = {
    0: {
      label: 'Setup Form',
      icon: faRectangleList,
      Component: SetupForm,
      pageWidth: 'wide',
    },
  };

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
