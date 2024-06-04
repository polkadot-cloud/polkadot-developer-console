// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { formatInputString } from 'Utils';
import type { ChainId, DirectoryId } from 'config/networks/types';
import { NetworkDirectory } from 'config/networks';
import { SearchInput } from 'library/ContextMenu/SearchInput';
import {
  ListWrapper,
  SearchWrapper,
  SelectListWrapper,
} from 'library/ContextMenu/Wrappers';
import { useRef, useState } from 'react';

export const ConnectContextMenu = ({
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

  const providers = Object.entries(
    NetworkDirectory[chainId as DirectoryId].providers
  );

  // Filter providers based on search term, if present.
  const filteredProviders =
    providerSearchTerm !== ''
      ? providers.filter(([name]) =>
          name
            .toLowerCase()
            .includes(formatInputString(providerSearchTerm, true))
        )
      : providers;

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <SelectListWrapper>
      <h5>Select Provider</h5>
      <SearchWrapper className="bg">
        <SearchInput
          inputRef={inputRef}
          value={providerSearchTerm}
          searchValue={providerSearchTerm}
          setSearchValue={setProviderSearchTerm}
          onChange={(ev) => handleOnChange(ev.currentTarget.value)}
          onEnter={() => {
            /* Do nothing */
          }}
          onEscape={() => {
            /* Do nothing */
          }}
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
