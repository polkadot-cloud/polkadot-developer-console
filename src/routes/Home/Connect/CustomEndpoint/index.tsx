// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SearchInput } from 'library/SearchInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faCircleRight,
} from '@fortawesome/free-solid-svg-icons';
import { useChainFilter } from 'contexts/ChainFilter';
import { ChainInputWrapper } from '../Wrappers';
import { ButtonSubmit } from 'library/Buttons/ButtonSubmit';
import { useActiveTab } from 'contexts/ActiveTab';
import { useChainBrowser } from 'contexts/ChainBrowser';

export const CustomEndpointInput = () => {
  const { tabId } = useActiveTab();
  const { connectChainBrowser } = useChainBrowser();
  const { getCustomEndpoint, setCustomEndpoint } = useChainFilter();

  // The editable value of the input.
  const customEndpoint = getCustomEndpoint(tabId);

  // Handle input change.
  const onChange = (value: string) => {
    //  If trimmed value and the current value is empty, don't update.
    if (!(!value.trim().length && customEndpoint === '')) {
      setCustomEndpoint(tabId, value);
    }
  };

  return (
    <ChainInputWrapper>
      <SearchInput
        placeholder="wss://"
        value={customEndpoint}
        onChange={onChange}
        icon={faChevronRight}
        iconTransform="shrink-3"
      />

      <div className="footer">
        <ButtonSubmit
          onClick={() => {
            connectChainBrowser(tabId, 'custom', customEndpoint);
          }}
        >
          Connect
          <FontAwesomeIcon
            icon={faCircleRight}
            transform="shrink-1"
            className="iconRight"
          />
        </ButtonSubmit>
      </div>
    </ChainInputWrapper>
  );
};
