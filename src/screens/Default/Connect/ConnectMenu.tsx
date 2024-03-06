// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { formatInputString } from 'Utils';
import type { ChainId } from 'config/networks';
import { NetworkDirectory } from 'config/networks';
import { ListWrapper, SelectListWrapper } from 'library/ContextMenu/Wrappers';
import { useState } from 'react';

export const ConnectMenu = ({
  chainId,
  onSelect,
}: {
  chainId: ChainId;
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
      <div className="search">
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
      </div>
      <ListWrapper>
        {filteredProviders.map(([name, url], index) => (
          <li key={`provider_context_item_${index}`}>
            <button onClick={() => onSelect(name)} />

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
