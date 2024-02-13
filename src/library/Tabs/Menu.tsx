import { faCheck, faCode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ListWrapper } from 'library/Menu/Wrappers';

export const Menu = () => (
  <ListWrapper>
    {[1, 2, 3, 4].map((item) => (
      <li key={item}>
        <div className="inner">
          <div>
            <FontAwesomeIcon icon={faCheck} transform="shrink-2" />
          </div>
          <div>
            <button
              onClick={() => {
                /* Do nothing */
              }}
            >
              Menu Item
            </button>
          </div>
          <div>
            <FontAwesomeIcon icon={faCode} transform="shrink-2" />
          </div>
        </div>
      </li>
    ))}
  </ListWrapper>
);
