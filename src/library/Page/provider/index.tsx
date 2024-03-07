// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createContext, useContext, useState } from 'react';
import { defaultActiveSection, defaultSectionContext } from './defaults';
import type { SectionContextInterface, SectionContextProps } from './types';
import * as local from './Local';
import { useEffectIgnoreInitial } from '@w3ux/hooks';
import { useTabs } from 'contexts/Tabs';
import { useApi } from 'contexts/Api';

export const SectionContext = createContext<SectionContextInterface>(
  defaultSectionContext
);

export const useSection = () => useContext(SectionContext);

export const SectionProvider = ({ pageId, children }: SectionContextProps) => {
  const { getApiActive } = useApi();
  const { activeTabId } = useTabs();
  const { redirectCounter } = useTabs();

  const apiActive = getApiActive(activeTabId);

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

  // Handle redirects from local storage, if present.
  useEffectIgnoreInitial(() => {
    const redirect = local.getSectionRedirect(pageId, activeTabId);
    const localActive = local.getActiveSection(pageId, activeTabId);
    if (redirect) {
      setActiveSection(redirect || localActive || defaultActiveSection, false);
    } else {
      setActiveSection(localActive || defaultActiveSection);
    }
  }, [pageId, activeTabId, redirectCounter, apiActive]);

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
