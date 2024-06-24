// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  faBarsProgress,
  faLink,
  faLinkSlash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useChainExplorer } from 'contexts/ChainExplorer';
import { useChainSpaceEnv } from 'contexts/ChainSpaceEnv';
import { useMenu } from 'contexts/Menu';
import { useParaSetup } from 'contexts/ParaSetup';
import { useSettings } from 'contexts/Settings';
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
  const { autoTabNaming } = useSettings();
  const { getApiStatus, destroyAllApiInstances, instantiateApiFromTab } =
    useChainSpaceEnv();
  const { destroyTabParaSetup } = useParaSetup();
  const { removeChainExplorerTaskState } = useChainExplorer();
  const { getTab, renameTab, getAutoTabName, setTabActiveTask } = useTabs();

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

  const apiStatusText = canDisconnect
    ? 'Disconnect'
    : apiStatus === 'connecting'
      ? 'Connecting..'
      : canReconnect
        ? 'Reconnect'
        : 'Not Connected';

  const apiButtonInactive = apiStatusActive || canReconnect;

  // Handle disconnect from tab.
  const handleDisconnectTab = () => {
    destroyAllApiInstances(ownerId);

    // Reset task related state.
    removeChainExplorerTaskState(tabId);
    destroyTabParaSetup(tabId);

    // Reset tab name if auto naming is enabled.
    if (autoTabNaming) {
      renameTab(tabId, getAutoTabName(tabId, 'New Tab'));
    }
  };

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
        <li className={`${apiButtonInactive ? `` : ` inactive`}`}>
          <button
            onClick={() => {
              if (canDisconnect) {
                handleDisconnectTab();
              } else if (canReconnect) {
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
            <div
              className={!canDisconnect && !canReconnect ? 'none' : undefined}
            >
              {canDisconnect && (
                <FontAwesomeIcon icon={faLinkSlash} transform="shrink-4" />
              )}
              {canReconnect && (
                <FontAwesomeIcon icon={faLink} transform="shrink-3" />
              )}
            </div>
            <div>
              <h3 className={apiButtonInactive ? undefined : 'inactive'}>
                {apiStatusText}
              </h3>
            </div>
            <div></div>
          </div>
        </li>
      </ListWrapper>
    </SelectListWrapper>
  );
};
