// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SettingsHeaderWrapper } from 'library/Settings/Wrappers';
import { RenameTab } from './RenameTab';
import { AutoConnect } from '../../../library/AutoConnect';
import {
  SettingsSubmitWrapper,
  SettingsToggleWrapper,
} from 'routes/Settings/TabSettings/Wrappers';
import { ApiController } from 'controllers/Api';
import { useTabs } from 'contexts/Tabs';
import { useRoute } from 'contexts/Route';
import { useApi } from 'contexts/Api';

export const ManageTab = () => {
  const { getApiStatus } = useApi();
  const { activeTabId } = useTabs();
  const { setActivePage } = useRoute();

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

      <RenameTab />

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
