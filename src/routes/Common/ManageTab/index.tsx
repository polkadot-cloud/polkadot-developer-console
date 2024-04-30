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
import { useActiveTab } from 'contexts/ActiveTab';
import { SubHeadingWrapper } from './Wrappers';
import { isDirectoryId } from 'config/networks/Utils';
import { tabIdToOwnerId } from 'contexts/Tabs/Utils';

export const ManageTab = () => {
  const {
    setTabForceDisconnect,
    renameTab,
    updateSs58,
    updateUnits,
    updateUnit,
  } = useTabs();
  const { getApiStatus } = useApi();
  const { setActivePage } = useRoute();
  const { tab, tabId } = useActiveTab();

  const apiStatus = getApiStatus(tabIdToOwnerId(tabId));
  const showDisconnect = ['ready', 'connected', 'connecting'].includes(
    apiStatus
  );

  // Determine whether this is a custom endpoint. If it is, we want to allow the chain metadata to
  // be updated.
  const isDirectory = isDirectoryId(tab?.chain?.id || '');

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
                updateSs58(tabId, valueInt);
              }
            }}
            initialValue={String(tab?.chain?.ss58 || '0')}
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
            initialValue={String(tab?.chain?.units || '')}
          />
          <Input
            label="Chain Unit"
            placeholder="UNIT"
            onSubmit={(value: string) => {
              updateUnit(tabId, value);
            }}
            initialValue={String(tab?.chain?.unit || '')}
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
                    setTabForceDisconnect(tabId, true);
                    ApiController.destroy(tabIdToOwnerId(tabId));
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
