// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { formatInputString } from 'Utils';
import type { DirectoryId } from 'config/networks';
import { NetworkDirectory } from 'config/networks';
import {
  ListWrapper,
  SearchWrapper,
  SelectListWrapper,
} from 'library/ContextMenu/Wrappers';
import { useState } from 'react';

export const ConnectMenu = ({
  chainId,
  onSelect,
}: {
  chainId: DirectoryId;
  onSelect: (provider: string) => void;
}) => {
  // Provider search term.
  const [providerSearchTerm, setProviderSearchTerm] = useState<string>('');

  // Handle tag search change.
  const handleOnChange = (value: string) => {
    setProviderSearchTerm(value);
  };

  const providers = Object.entries(NetworkDirectory[chainId].providers);

  // Filter providers based on search term, if present.
  const filteredProviders =
    providerSearchTerm !== ''
      ? providers.filter(([name]) =>
          name
            .toLowerCase()
            .includes(formatInputString(providerSearchTerm, true))
        )
      : providers;

  return (
    <SelectListWrapper>
      <h5>Select Provider</h5>
      <SearchWrapper>
        <input
          placeholder="Search"
          value={providerSearchTerm}
          onFocus={() => {
            /* Do nothing */
          }}
          onBlur={() => {
            /* Do nothing */
          }}
          onChange={(ev) => handleOnChange(ev.currentTarget.value)}
        />
      </SearchWrapper>
      <ListWrapper>
        {filteredProviders.map(([name, url], index) => (
          <li key={`provider_context_item_${index}`}>
            <button onClick={() => onSelect(url)} />

            <div className="inner">
              <div className="none"></div>
              <div>
                <h3>{name}</h3>
              </div>
              <div>
                <h5>{url}</h5>
              </div>
            </div>
          </li>
        ))}
      </ListWrapper>
    </SelectListWrapper>
  );
};
