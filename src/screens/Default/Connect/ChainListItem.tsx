// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Suspense, lazy, useMemo } from 'react';
import { ChainListItemWrapper } from './Wrappers';
import { Tag } from 'library/Tag';
import { useTags } from 'contexts/Tags';
import { TagControl } from 'library/TagControl';
import { faCircleRight, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useMenu } from 'contexts/Menu';
import { ConfigTagMenu } from './TagsMenu/ConfigTagMenu';
import type { TagId } from 'contexts/Tags/types';
import type { ChainId } from 'config/networks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ConnectMenu } from './ConnectMenu';

export interface ChainListItemProps {
  chain: ChainId;
  name: string;
}

export const ChainListItem = ({ chain, name }: ChainListItemProps) => {
  const { openMenu } = useMenu();
  const { tags, getTagsForChain, addChainToTag, removeChainFromTag } =
    useTags();
  const chainTags = getTagsForChain(chain);

  // Lazily load the icon for the chain.
  const Icon = useMemo(
    () =>
      lazy(() => import(`../../../config/networks/icons/${chain}/Inline.tsx`)),
    []
  );

  // Handle tag provider select. Connect to chain on successful selection.
  const handleOnProviderSelect = (providerUrl: string) => {
    console.log(providerUrl);
  };

  // Handle tag menu item select. Either add or remove a tag configs.
  const handleOnTagSelect = (tagId: TagId, selected: boolean) => {
    if (selected) {
      removeChainFromTag(tagId, chain);
    } else {
      addChainToTag(tagId, chain);
    }
  };

  return (
    <ChainListItemWrapper>
      <div className="header">
        <section>
          <Suspense fallback={<div />}>
            <div className="icon">
              <Icon />
            </div>
          </Suspense>
          <h3>{name}</h3>
        </section>
        <section>
          <button
            onClick={(ev) => {
              openMenu(
                ev,
                <ConnectMenu
                  chainId={chain}
                  onSelect={handleOnProviderSelect}
                />
              );
            }}
          >
            Connect
            <FontAwesomeIcon icon={faCircleRight} transform="shrink-1" />
          </button>
        </section>
      </div>

      <div className="body">
        <h5>{chain}</h5>
      </div>

      <div className="footer">
        <div className="tags">
          {chainTags.length
            ? chainTags.map((tag) => (
                <Tag key={`tag_${tag}`} name={tags[tag].name} />
              ))
            : null}
          <TagControl
            light
            name={'Add'}
            icon={faPlus}
            onClick={(ev) => {
              openMenu(
                ev,
                <ConfigTagMenu chainId={chain} onSelect={handleOnTagSelect} />
              );
            }}
          />
        </div>
      </div>
    </ChainListItemWrapper>
  );
};
