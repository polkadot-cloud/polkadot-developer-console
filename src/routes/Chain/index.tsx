// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PageWithMenu } from 'routes/Common/PageWithMenu';
import type { PageSections, RouteSectionProvider } from 'routes/Common/types';
import { Overview } from './Overview';
import { Extrinsics } from './Extrinsics';
import { ChainState } from './ChainState';
import { TabMenu } from '../../library/TabMenu';
import { PageContent } from 'library/PageContent';

export const useRouteSections = (): RouteSectionProvider => {
  const sections: PageSections = {
    0: {
      label: 'Overview',
      Component: Overview,
    },
    1: {
      label: 'Chain State',
      Component: ChainState,
    },
    2: {
      label: 'Extrinsics',
      Component: Extrinsics,
    },
  };

  return { label: 'Chain', sections };
};

export const Chain = () => (
  <PageWithMenu
    route="default"
    Page={PageContent}
    Menu={TabMenu}
    routeProvider={useRouteSections}
  />
);
