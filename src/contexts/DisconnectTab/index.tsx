// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { createContext, useContext } from 'react';
import { defaultDisconnectTabContext } from './defaults';
import type {
  DisconnectTabContextInterface,
  DisconnectTabProps,
} from './types';
import { useChainSpaceEnv } from 'contexts/ChainSpaceEnv';
import type { OwnerId } from 'types';
import { ownerIdToTabId } from 'contexts/Tabs/Utils';
import { useParaSetup } from 'contexts/ParaSetup';
import { useChainExplorer } from 'contexts/ChainExplorer';
import { useSettings } from 'contexts/Settings';
import { useTabs } from 'contexts/Tabs';
import { useChainUi } from 'contexts/ChainUi';
import { useInputMeta } from 'contexts/InputMeta';
import { useChainFilter } from 'contexts/ChainFilter';

export const DisconnectTab = createContext<DisconnectTabContextInterface>(
  defaultDisconnectTabContext
);

export const useDisconnectTab = () => useContext(DisconnectTab);

export const DisconnectTabProvider = ({ children }: DisconnectTabProps) => {
  const { autoTabNaming } = useSettings();
  const { destroyTabChainUi } = useChainUi();
  const { destroyInputMeta } = useInputMeta();
  const { destroyChainFilter } = useChainFilter();
  const { destroyStateParaSetup } = useParaSetup();
  const { destroyAllApiInstances } = useChainSpaceEnv();
  const { destroyStateChainExplorer } = useChainExplorer();
  const { renameTab, getAutoTabName, destroyTab } = useTabs();

  // Handle disconnect (and destroy) of a tab, handling both api and task related clean up before
  // destroying the tab itself with the provided index.
  const disconnectTab = (ownerId: OwnerId, destroyIndex?: number) => {
    const tabId = ownerIdToTabId(ownerId);

    // If destroying tab, destroy ui state associated with this tab.
    if (destroyIndex) {
      destroyTabChainUi(tabId);
      destroyInputMeta(tabId);
      destroyChainFilter(tabId);
    }

    // Destroy all api instances related to the tab.
    destroyAllApiInstances(ownerId);

    // Reset task related state.
    destroyStateChainExplorer(tabId);
    destroyStateParaSetup(tabId);

    // If not destroying tab, Reset tab name if auto naming is enabled.
    if (!destroyIndex && autoTabNaming) {
      renameTab(tabId, getAutoTabName(tabId, 'New Tab'));
    }

    // If destroying tab, destroy the tab itself.
    if (destroyIndex !== undefined) {
      destroyTab(destroyIndex, tabId);
    }
  };
  return (
    <DisconnectTab.Provider
      value={{
        disconnectTab,
      }}
    >
      {children}
    </DisconnectTab.Provider>
  );
};
