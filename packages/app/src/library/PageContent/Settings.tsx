// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { PageContentWrapper } from './Wrappers';
import type { PageProps } from 'routes/Common/PageWithMenu/types';
import { useSettings } from 'contexts/Settings';

export const SettingsContent = ({ sections, pageWidth }: PageProps) => {
  const { activePage } = useSettings();
  let width;

  // Attempt to get the component and width from the sections object.
  let ActiveComponent = sections?.[activePage]?.Component;
  width = sections?.[activePage]?.pageWidth || pageWidth;

  // If no active component was assigned at the provided page index, try to get the first one.
  if (!ActiveComponent) {
    ActiveComponent = sections?.[0]?.Component;
    width = sections?.[0]?.pageWidth || pageWidth;
  }

  return (
    <PageContentWrapper className={width}>
      <ActiveComponent />
    </PageContentWrapper>
  );
};
