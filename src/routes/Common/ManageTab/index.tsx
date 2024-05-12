// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SettingsHeaderWrapper } from 'library/Settings/Wrappers';
import { Input } from './Input';
import { AutoConnect } from 'library/AutoConnect';
import {
  SettingsSubmitWrapper,
  SettingsToggleWrapper,
} from 'routes/Settings/TabSettings/Wrappers';
import { ApiController } from 'controllers/Api';
import { useTabs } from 'contexts/Tabs';
import { useActiveTab } from 'contexts/ActiveTab';
import { SubHeadingWrapper } from './Wrappers';
import { isDirectoryId } from 'config/networks/Utils';
import { useChainBrowser } from 'contexts/ChainBrowser';
import { ACTIVE_API_STATUSES } from 'model/Api/defaults';
import { useChainSpaceEnv } from 'contexts/ChainSpaceEnv';
import { useApiIndexer } from 'contexts/ApiIndexer';

export const ManageTab = () => {
  const { renameTab } = useTabs();
  const { getTabApiIndex } = useApiIndexer();
  const { getApiStatus } = useChainSpaceEnv();
  const { tab, tabId, ownerId } = useActiveTab();
  const { updateSs58, updateUnits, updateUnit } = useChainBrowser();

  const apiInstanceId = getTabApiIndex(ownerId, 'chainBrowser')?.instanceId;
  const apiStatus = getApiStatus(apiInstanceId);
  const apiDisconnected = !ACTIVE_API_STATUSES.includes(apiStatus);

  // Determine whether this is a custom endpoint. If it is, we want to allow the chain metadata to
  // be updated.
  const isDirectory = isDirectoryId(tab?.taskData?.chain?.id || '');

  return (
    <>
      <SettingsHeaderWrapper>
        <h2>Manage Tab</h2>
        <div>
          <AutoConnect />
        </div>
      </SettingsHeaderWrapper>
      <Input
        label="Rename Tab"
        placeholder="Tab Name"
        onSubmit={(value: string) => {
          renameTab(tabId, value);
        }}
        initialValue={tab?.name || ''}
      />
      {!isDirectory && !apiDisconnected && (
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

      {!apiDisconnected && (
        <>
          <SettingsToggleWrapper>
            <div className="text">
              <h4>Disconnect</h4>
              <h3>This tab is currently connected to an API instance.</h3>
            </div>
          </SettingsToggleWrapper>

          <SettingsSubmitWrapper>
            <div className="buttons">
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      'Are you sure you want to disconnect this tab?'
                    )
                  ) {
                    if (tab?.taskData?.chain) {
                      ApiController.destroyAll(ownerId);
                    }
                  }
                }}
              >
                Disconnect from API
              </button>
            </div>
          </SettingsSubmitWrapper>
        </>
      )}
    </>
  );
};
