// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import {
  faBarsProgress,
  faLink,
  faLinkSlash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useChainSpaceEnv } from 'contexts/ChainSpaceEnv';
import { useDisconnectTab } from 'contexts/DisconnectTab';
import { useMenu } from 'contexts/Menu';
import { useTabs } from 'contexts/Tabs';
import { tabIdToOwnerId } from 'contexts/Tabs/Utils';
import type { TabTask } from 'contexts/Tabs/types';
import { ListWrapper, SelectListWrapper } from 'library/ContextMenu/Wrappers';

export const TabContextMenu = ({
  tabId,
  onSettings,
}: {
  tabId: number;
  onSettings: () => void;
}) => {
  const { closeMenu } = useMenu();
  const { disconnectTab } = useDisconnectTab();
  const { getTab, setTabActiveTask } = useTabs();
  const { getApiStatus, instantiateApiFromTab } = useChainSpaceEnv();

  const tab = getTab(tabId);
  const ownerId = tabIdToOwnerId(tabId);
  const apiStatus = getApiStatus(`${ownerId}_0`);

  const apiStatusActive = ['ready', 'connected', 'connecting'].includes(
    apiStatus
  );
  const canDisconnect = ['ready', 'connected', 'connecting'].includes(
    apiStatus
  );
  const canReconnect =
    !!tab?.taskData?.id &&
    !!tab?.taskData?.chain?.id &&
    !canDisconnect &&
    !apiStatusActive;

  return (
    <SelectListWrapper>
      <ListWrapper>
        <li>
          <button type="button" onClick={() => onSettings()}></button>
          <div className="inner">
            <div>
              <FontAwesomeIcon icon={faBarsProgress} transform="shrink-2" />
            </div>
            <div>
              <h3>Manage Tab</h3>
            </div>
            <div></div>
          </div>
        </li>
      </ListWrapper>
      <h5 className="inline">API</h5>
      <ListWrapper>
        {canReconnect && (
          <li>
            <button
              onClick={() => {
                if (canReconnect) {
                  instantiateApiFromTab(tabId);
                  // Update tab task. NOTE: We know for certain with `canReconnect` that
                  // `tab.taskData` is defined.
                  const tabTask = tab.taskData!.id as TabTask;
                  setTabActiveTask(tabId, tabTask);
                }
                closeMenu();
              }}
            ></button>
            <div className="inner">
              <div className={!canReconnect ? 'none' : undefined}>
                {canReconnect && (
                  <FontAwesomeIcon icon={faLink} transform="shrink-3" />
                )}
              </div>
              <div>
                <h3 className={canReconnect ? undefined : 'inactive'}>
                  {canReconnect ? 'Reconnect' : 'Not Connected'}
                </h3>
              </div>
              <div></div>
            </div>
          </li>
        )}

        <li className={`${canDisconnect ? `` : ` inactive`}`}>
          <button
            onClick={() => {
              if (canDisconnect) {
                disconnectTab(ownerId);
              }
              closeMenu();
            }}
          ></button>
          <div className="inner">
            <div className={!canDisconnect ? 'none' : undefined}>
              {canDisconnect && (
                <FontAwesomeIcon icon={faLinkSlash} transform="shrink-4" />
              )}
            </div>
            <div>
              <h3 className={apiStatusActive ? undefined : 'inactive'}>
                {canDisconnect
                  ? 'Disconnect'
                  : apiStatus === 'connecting'
                    ? 'Connecting..'
                    : 'Not Connected'}
              </h3>
            </div>
            <div></div>
          </div>
        </li>
      </ListWrapper>
    </SelectListWrapper>
  );
};
