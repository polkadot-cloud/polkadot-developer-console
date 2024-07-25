// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { SettingsHeaderWrapper } from 'library/Settings/Wrappers';
import { Input } from './Input';
import { AutoConnect } from 'library/AutoConnect';
import {
  SettingsSubmitWrapper,
  SettingsToggleWrapper,
} from 'routes/Settings/TabSettings/Wrappers';
import { useTabs } from 'contexts/Tabs';
import { useActiveTab } from 'contexts/ActiveTab';
import { SubHeadingWrapper } from './Wrappers';
import { isDirectoryId } from 'config/networks/Utils';
import { useChainExplorer } from 'contexts/ChainExplorer';
import { useApiIndexer } from 'contexts/ApiIndexer';
import { useDisconnectTab } from 'contexts/DisconnectTab';

export const ManageTab = () => {
  const { disconnectTab } = useDisconnectTab();
  const { getTabApiIndexes } = useApiIndexer();
  const { tab, tabId, ownerId } = useActiveTab();
  const { renameTab, getTabActiveTask } = useTabs();
  const { updateSs58, updateUnits, updateUnit } = useChainExplorer();

  const activeTask = getTabActiveTask(tabId);
  const apiInstances = getTabApiIndexes(ownerId);

  // Determine whether this is a custom endpoint. If it is, we want to allow the chain metadata to
  // be updated. Only used in `chainExplorer` task.
  const isCustomChain =
    tab?.taskData?.chain !== undefined &&
    !isDirectoryId(tab.taskData.chain?.id || '');

  // Handle disconnecting from tab.
  const confirmDisconnectTab = () => {
    if (window.confirm('Are you sure you want to disconnect this tab?')) {
      disconnectTab(ownerId);
    }
  };

  return (
    <>
      <SettingsHeaderWrapper>
        <h2>Manage Tab</h2>
        {activeTask === 'chainExplorer' && (
          <div>
            <AutoConnect />
          </div>
        )}
      </SettingsHeaderWrapper>
      <Input
        label="Rename Tab"
        placeholder="Tab Name"
        onSubmit={(value: string) => renameTab(tabId, value)}
        initialValue={tab?.name || ''}
      />
      {isCustomChain && apiInstances.length && (
        <>
          <SubHeadingWrapper>Chain Metadata</SubHeadingWrapper>

          <Input
            label="SS58"
            placeholder="0"
            onSubmit={(value: string) => {
              if (!isNaN(Number(value)) && Number.isInteger(Number(value))) {
                // Ensure whole number with no decimals.
                const valueInt = Math.ceil(Number(value));
                updateSs58(tabId, valueInt);
              }
            }}
            initialValue={String(tab?.taskData?.chain?.ss58 || '0')}
          />
          <Input
            label="Chain Units"
            placeholder="10"
            onSubmit={(value: string) => {
              if (!isNaN(Number(value)) && Number.isInteger(Number(value))) {
                // Ensure whole number with no decimals.
                const valueInt = Math.ceil(Number(value));
                updateUnits(tabId, valueInt);
              }
            }}
            initialValue={String(tab?.taskData?.chain?.units || '')}
          />
          <Input
            label="Chain Unit"
            placeholder="UNIT"
            onSubmit={(value: string) => {
              updateUnit(tabId, value);
            }}
            initialValue={String(tab?.taskData?.chain?.unit || '')}
          />
        </>
      )}

      {apiInstances.length > 0 && (
        <>
          <SettingsToggleWrapper>
            <div className="text">
              <h4>Disconnect</h4>
              <h3>
                This tab is currently connected to{' '}
                {apiInstances.length === 1
                  ? 'an API instance'
                  : `${apiInstances.length} API instances`}
                .
              </h3>
            </div>
          </SettingsToggleWrapper>

          <SettingsSubmitWrapper>
            <div className="buttons">
              <button onClick={() => confirmDisconnectTab()}>
                Disconnect from API
              </button>
            </div>
          </SettingsSubmitWrapper>
        </>
      )}
    </>
  );
};
