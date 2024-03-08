// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SearchInput } from 'library/SearchInput';
import { ConnectButton, ChainInputWrapper } from './Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faCircleRight,
} from '@fortawesome/free-solid-svg-icons';

export const LocalNodeInput = () => {
  // const { activeTabId } = useTabs();

  // The editable value of the input.
  // const searchTerm = getSearchTerm(activeTabId);

  // Handle input change.
  const onChange = (value: string) => {
    /* TODO: implement */
    console.log(value);
    // If trimmed value and the current value is empty, don't update.
    // if (!(!value.trim().length && searchTerm === '')) {
    //   // setSearchTerm(activeTabId, value);
    // }
  };

  return (
    <ChainInputWrapper>
      <SearchInput
        placeholder="ws://"
        value={''}
        onChange={onChange}
        icon={faChevronRight}
        iconTransform="shrink-3"
      />

      <div className="footer">
        <ConnectButton
          onClick={() => {
            /* Do nothing */
          }}
        >
          Connect
          <FontAwesomeIcon icon={faCircleRight} transform="shrink-1" />
        </ConnectButton>
      </div>
    </ChainInputWrapper>
  );
};
