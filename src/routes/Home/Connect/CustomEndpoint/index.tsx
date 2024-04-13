// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SearchInput } from 'library/SearchInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faCircleRight,
} from '@fortawesome/free-solid-svg-icons';
import { useTabs } from 'contexts/Tabs';
import { useChainFilter } from 'contexts/ChainFilter';
import { ChainInputWrapper } from '../Wrappers';
import { ButtonSubmit } from 'library/Buttons/ButtonSubmit';
import { useActiveTabId } from 'contexts/ActiveTab';

export const CustomEndpointInput = () => {
  const { connectTab } = useTabs();
  const activeTabId = useActiveTabId();
  const { getCustomEndpoint, setCustomEndpoint } = useChainFilter();

  // The editable value of the input.
  const customEndpoint = getCustomEndpoint(activeTabId);

  // Handle input change.
  const onChange = (value: string) => {
    //  If trimmed value and the current value is empty, don't update.
    if (!(!value.trim().length && customEndpoint === '')) {
      setCustomEndpoint(activeTabId, value);
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
            connectTab(activeTabId, 'custom', customEndpoint);
          }}
        >
          Connect
          <FontAwesomeIcon icon={faCircleRight} transform="shrink-1" />
        </ButtonSubmit>
      </div>
    </ChainInputWrapper>
  );
};