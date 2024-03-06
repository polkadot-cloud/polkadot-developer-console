import { faBarsProgress } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ListWrapper, SelectListWrapper } from 'library/ContextMenu/Wrappers';

export const TabMenu = ({
  // tabId,
  onSettings,
}: {
  tabId: number;
  onSettings: () => void;
}) => (
  <SelectListWrapper>
    <ListWrapper>
      <li>
        <button onClick={() => onSettings()}></button>
        <div className="inner">
          <div className="none"></div>
          <div>
            <h3>Manage Tab</h3>
          </div>
          <div>
            <FontAwesomeIcon icon={faBarsProgress} transform="shrink-2" />
          </div>
        </div>
      </li>
    </ListWrapper>
  </SelectListWrapper>
);
