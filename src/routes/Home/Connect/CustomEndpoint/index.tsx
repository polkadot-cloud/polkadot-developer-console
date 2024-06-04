// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SearchInput } from 'library/SearchInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faCircleRight,
} from '@fortawesome/free-solid-svg-icons';
import { useChainFilter } from 'contexts/ChainFilter';
import { ChainInputWrapper } from '../Wrappers';
import { ButtonText } from 'library/Buttons/ButtonText';
import { useActiveTab } from 'contexts/ActiveTab';
import { useChainExplorer } from 'contexts/ChainExplorer';

export const CustomEndpointInput = () => {
  const { tabId } = useActiveTab();
  const { connectChainExplorer } = useChainExplorer();
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
        <ButtonText
          onClick={() => {
            connectChainExplorer(tabId, 'custom', customEndpoint);
          }}
        >
          Connect
          <FontAwesomeIcon
            icon={faCircleRight}
            transform="shrink-1"
            className="iconRight"
          />
        </ButtonText>
      </div>
    </ChainInputWrapper>
  );
};
