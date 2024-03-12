// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PageWithMenu } from 'routes/Common/PageWithMenu';
import type { PageSections, RouteSectionProvider } from 'routes/Common/types';
import { TabMenu } from 'library/TabMenu';
import { Connect } from './Connect';
import { PageContent } from 'library/PageContent';

export const useRouteSections = (): RouteSectionProvider => {
  const sections: PageSections = {
    0: {
      label: 'Search Chain',
      Component: Connect,
    },
  };

  return { label: 'Connect', sections };
};

export const Default = () => (
  <PageWithMenu
    route="default"
    routeProvider={useRouteSections}
    Page={PageContent}
    Menu={TabMenu}
  />
);
