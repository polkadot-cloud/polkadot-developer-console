import { faBarsProgress, faLinkSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useApi } from 'contexts/Api';
import { useMenu } from 'contexts/Menu';
import { ApiController } from 'controllers/ApiController';
import { ListWrapper, SelectListWrapper } from 'library/ContextMenu/Wrappers';

export const TabMenu = ({
  tabId,
  onSettings,
}: {
  tabId: number;
  onSettings: () => void;
}) => {
  const { closeMenu } = useMenu();
  const { getApiStatus } = useApi();
  const apiStatus = getApiStatus(tabId);

  const showDisconnect = ['ready', 'connected'].includes(apiStatus);

  const apiStatusText = showDisconnect
    ? 'Disconnect'
    : apiStatus === 'connecting'
      ? 'Connecting..'
      : 'Not Connected';

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
        <li>
          <button
            onClick={() => {
              if (showDisconnect) {
                ApiController.destroy(tabId);
                closeMenu();
              }
            }}
          ></button>
          <div className="inner">
            <div className={!showDisconnect ? 'none' : undefined}>
              {showDisconnect && (
                <FontAwesomeIcon icon={faLinkSlash} transform="shrink-4" />
              )}
            </div>
            <div>
              <h3
                className={
                  ['ready', 'connected', 'disconnected'].includes(apiStatus)
                    ? undefined
                    : 'inactive'
                }
              >
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
