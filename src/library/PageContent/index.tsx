// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useRoute } from 'contexts/Route';
import { PageContentWrapper } from './Wrappers';
import type { PageProps } from 'routes/Common/PageWithMenu/types';
import { ManageTab } from 'routes/Common/ManageTab';

export const PageContent = ({ sections }: PageProps) => {
  const { activePage } = useRoute();
  const Component = sections?.[activePage]?.Component;

  // TODO: add fallback component if Component and tab menu is not active.
  return (
    <PageContentWrapper>
      {Component !== undefined ? (
        <Component />
      ) : activePage === 9 ? (
        <ManageTab />
      ) : null}
    </PageContentWrapper>
  );
};
