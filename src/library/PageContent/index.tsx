// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useRoute } from 'contexts/Route';
import { PageContentWrapper } from './Wrappers';
import type { PageProps } from 'routes/Common/PageWithMenu/types';
import { ManageTab } from 'routes/Common/ManageTab';
import { Directory } from 'routes/Home/Connect/Directory';

export const PageContent = ({ sections, pageWidth }: PageProps) => {
  const { activePage } = useRoute();

  // NOTE: page section 9 is a reserved id for `ManageTab`.
  let Component;
  let width;

  if (activePage === 9) {
    Component = ManageTab;
    width = 'thin';
  } else {
    Component = sections?.[activePage]?.Component;
    width = sections?.[activePage]?.pageWidth || pageWidth;
  }

  return (
    <PageContentWrapper className={width}>
      {Component !== undefined ? (
        <Component />
      ) : activePage === 9 ? (
        <ManageTab />
      ) : (
        <Directory />
      )}
    </PageContentWrapper>
  );
};
