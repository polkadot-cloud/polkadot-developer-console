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

export const ManageTab = () => {
  const { getApiStatus } = useApi();
  const { setActivePage } = useRoute();
  const activeTabId = useActiveTabId();
  const { setTabForceDisconnect, renameTab, getTab } = useTabs();

  const activeTab = getTab(activeTabId);
  const apiStatus = getApiStatus(activeTabId);
  const showDisconnect = ['ready', 'connected', 'connecting'].includes(
    apiStatus
  );

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
      <SubHeadingWrapper>Chain Metadata</SubHeadingWrapper>

      <Input
        label="SS58"
        placeholder="0"
        onSubmit={(value: string) => {
          if (!isNaN(Number(value)) && Number.isInteger(Number(value))) {
            // Ensure whole number with no decimals.
            const valueInt = Math.ceil(Number(value));
            /* TODO: Implement update */
            console.log(valueInt);
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
            /* TODO: Implement update */
            console.log(valueInt);
          }
        }}
        initialValue={String(activeTab?.chain?.units || '')}
      />
      <Input
        label="Chain Unit"
        placeholder="UNIT"
        onSubmit={(value: string) => {
          /* TODO: Implement */
          console.log(value);
        }}
        initialValue={String(activeTab?.chain?.unit || '')}
      />
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
                    ApiController.destroy(activeTabId);
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
