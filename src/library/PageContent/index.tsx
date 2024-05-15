// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PageContentWrapper } from './Wrappers';
import type { PageProps } from 'routes/Common/PageWithMenu/types';
import { ManageTab } from 'routes/Common/ManageTab';
import { useActiveTab } from 'contexts/ActiveTab';
import type { ReactNode } from 'react';

export const PageContent = ({
  sections,
  pageWidth,
  integrityCheck,
}: PageProps) => {
  const { tab, tabId } = useActiveTab();

  const activePage = tab?.activePage || 0;

  let Component: ReactNode;
  let width;

  // NOTE: page section 9 is a reserved id for `ManageTab`.
  if (activePage !== 9) {
    // Attempt to get the component and width from the sections object.
    let ActiveComponent = sections?.[activePage]?.Component;
    width = sections?.[activePage]?.pageWidth || pageWidth;

    // If no active component was assigned at the provided page index, try to get the first one.
    if (!ActiveComponent) {
      ActiveComponent = sections?.[0]?.Component;
      width = sections?.[0]?.pageWidth || pageWidth;
    }

    // If component exists, continue to process any integrity checks, or just render the component
    // otherwise.
    if (ActiveComponent !== undefined) {
      // The provided component is only rendered if the task integrity check passes. The result of
      // the integrity check is passed to the task Context to prevent child components from having
      // to check for undefined values and general data integrity tests.
      if (integrityCheck) {
        const { Preload, Context, fn, preloadWidth } = integrityCheck;
        const integrityCheckResult = fn(tabId);

        if (!integrityCheckResult) {
          Component = <Preload />;
          width = preloadWidth;
        } else {
          Component = (
            <Context {...integrityCheckResult}>
              <ActiveComponent />
            </Context>
          );
        }
      } else {
        Component = <ActiveComponent />;
      }
    }
  }

  // If no component was found, default to the ManageTab component.
  if (activePage === 9 || !Component) {
    Component = <ManageTab />;
    width = 'thin';
  }

  return <PageContentWrapper className={width}>{Component}</PageContentWrapper>;
};
