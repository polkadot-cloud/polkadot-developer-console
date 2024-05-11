// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  faBarsProgress,
  faLink,
  faLinkSlash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useApi } from 'contexts/Api';
import { useMenu } from 'contexts/Menu';
import { useTabs } from 'contexts/Tabs';
import { tabIdToOwnerId } from 'contexts/Tabs/Utils';
import { ApiController } from 'controllers/Api';
import { ListWrapper, SelectListWrapper } from 'library/ContextMenu/Wrappers';

export const TabContextMenu = ({
  tabId,
  onSettings,
}: {
  tabId: number;
  onSettings: () => void;
}) => {
  const {
    getTab,
    setTabActiveTask,
    setTabForceDisconnect,
    instantiateApiFromTab,
  } = useTabs();
  const { closeMenu } = useMenu();
  const { getApiStatus } = useApi();

  const tab = getTab(tabId);
  const ownerId = tabIdToOwnerId(tabId);
  const apiStatus = getApiStatus(`${ownerId}_0`);

  const apiStatusActive = ['ready', 'connected', 'connecting'].includes(
    apiStatus
  );
  const canDisconenct = ['ready', 'connected', 'connecting'].includes(
    apiStatus
  );
  const canReconnect =
    !!tab?.tabData?.chain?.id && !canDisconenct && !apiStatusActive;

  const apiStatusText = canDisconenct
    ? 'Disconnect'
    : apiStatus === 'connecting'
      ? 'Connecting..'
      : canReconnect
        ? 'Reconnect'
        : 'Not Connected';

  const apiButtonInactive = apiStatusActive || canReconnect;

  return (
    <SelectListWrapper>
      <ListWrapper>
        <li>
          <button onClick={() => onSettings()}></button>
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
              if (canDisconenct && tab?.tabData?.chain) {
                setTabForceDisconnect(tabId, true, true);
                ApiController.destroyAll(ownerId);
                closeMenu();
              } else if (canReconnect) {
                instantiateApiFromTab(tabId);
                // Update tab task.
                setTabActiveTask(tabId, 'connectChain');

                closeMenu();
              }
            }}
          ></button>
          <div className="inner">
            <div
              className={!canDisconenct && !canReconnect ? 'none' : undefined}
            >
              {canDisconenct && (
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
