// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createContext, useContext, useState } from 'react';
import { defaultActiveSection, defaultSectionContext } from './defaults';
import type { SectionContextInterface, SectionContextProps } from './types';
import * as local from './Local';
import { useEffectIgnoreInitial } from '@w3ux/hooks';
import { useTabs } from 'contexts/Tabs';
import { extractUrlValue, removeVarFromUrlHash } from '@w3ux/utils';
import { useMenu } from 'contexts/Menu';

export const SectionContext = createContext<SectionContextInterface>(
  defaultSectionContext
);

export const useSection = () => useContext(SectionContext);

export const SectionProvider = ({ pageId, children }: SectionContextProps) => {
  const { activeTabId } = useTabs();
  const { open: menuOpen } = useMenu();

  // The active section of the page.
  const [activeSection, setActiveSectionState] = useState<number>(
    local.getActiveSection(pageId, activeTabId) || defaultActiveSection
  );

  // Sets active section, and updates local storage if persisted.
  const setActiveSection = (section: number, persist = true) => {
    if (persist) {
      local.setActiveSection(pageId, activeTabId, section);
    }
    setActiveSectionState(section);
  };

  // Updates active section when active tab changes.
  const redirectHash = extractUrlValue('redirect');

  useEffectIgnoreInitial(() => {
    let redirected = false;
    if (redirectHash === 'manage-tab') {
      if (!menuOpen) {
        setActiveSection(1, false);
        removeVarFromUrlHash('redirect');
        redirected = true;
      }
    }

    if (!redirected) {
      setActiveSection(
        local.getActiveSection(pageId, activeTabId) || defaultActiveSection
      );
    }
  }, [pageId, activeTabId, menuOpen]);

  return (
    <SectionContext.Provider
      value={{
        activeSection,
        setActiveSection,
      }}
    >
      {children}
    </SectionContext.Provider>
  );
};
