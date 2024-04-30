// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SettingsHeaderWrapper } from 'library/Settings/Wrappers';
import { Input } from './Input';
import { AutoConnect } from '../../../library/AutoConnect';
import {
  SettingsSubmitWrapper,
  SettingsToggleWrapper,
} from 'routes/Settings/TabSettings/Wrappers';
import { ApiController } from 'controllers/Api';
import { useTabs } from 'contexts/Tabs';
import { useRoute } from 'contexts/Route';
import { useApi } from 'contexts/Api';
import { useActiveTabId } from 'contexts/ActiveTab';
import { SubHeadingWrapper } from './Wrappers';
import { isDirectoryId } from 'config/networks/Utils';
import { tabIdToOwnerId } from 'contexts/Tabs/Utils';

export const ManageTab = () => {
  const { getApiStatus } = useApi();
  const { setActivePage } = useRoute();
  const activeTabId = useActiveTabId();
  const {
    setTabForceDisconnect,
    renameTab,
    getTab,
    updateSs58,
    updateUnits,
    updateUnit,
  } = useTabs();

  const activeTab = getTab(activeTabId);
  const apiStatus = getApiStatus(tabIdToOwnerId(activeTabId));
  const showDisconnect = ['ready', 'connected', 'connecting'].includes(
    apiStatus
  );

  // Determine whether this is a custom endpoint. If it is, we want to allow the chain metadata to
  // be updated.
  const isDirectory = isDirectoryId(activeTab?.chain?.id || '');

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
          renameTab(activeTabId, value);
        }}
        initialValue={activeTab?.name || ''}
      />
      {!isDirectory && (
        <>
          <SubHeadingWrapper>Chain Metadata</SubHeadingWrapper>

          <Input
            label="SS58"
            placeholder="0"
            onSubmit={(value: string) => {
              if (!isNaN(Number(value)) && Number.isInteger(Number(value))) {
                // Ensure whole number with no decimals.
                const valueInt = Math.ceil(Number(value));
                updateSs58(activeTabId, valueInt);
              }
            }}
            initialValue={String(activeTab?.chain?.ss58 || '0')}
          />
          <Input
            label="Chain Units"
            placeholder="10"
            onSubmit={(value: string) => {
              if (!isNaN(Number(value)) && Number.isInteger(Number(value))) {
                // Ensure whole number with no decimals.
                const valueInt = Math.ceil(Number(value));
                updateUnits(activeTabId, valueInt);
              }
            }}
            initialValue={String(activeTab?.chain?.units || '')}
          />
          <Input
            label="Chain Unit"
            placeholder="UNIT"
            onSubmit={(value: string) => {
              updateUnit(activeTabId, value);
            }}
            initialValue={String(activeTab?.chain?.unit || '')}
          />
        </>
      )}

      {showDisconnect && (
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
                    setTabForceDisconnect(activeTabId, true);
                    ApiController.destroy(tabIdToOwnerId(activeTabId));
                    setActivePage(0);
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
