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
import { type ChainId } from 'config/networks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ConnectMenu } from './ConnectMenu';
import { useSettings } from 'contexts/Settings';
import { useTabs } from 'contexts/Tabs';

export interface ChainListItemProps {
  chainId: ChainId;
  name: string;
}

export const ChainListItem = ({ chainId, name }: ChainListItemProps) => {
  const { openMenu } = useMenu();
  const { autoTabNaming } = useSettings();
  const { activeTabId, getAutoTabName, renameTab } = useTabs();
  const { tags, getTagsForChain, addChainToTag, removeChainFromTag } =
    useTags();
  const chainTags = getTagsForChain(chainId);

  // Lazily load the icon for the chain.
  const Icon = useMemo(
    () =>
      lazy(
        () => import(`../../../config/networks/icons/${chainId}/Inline.tsx`)
      ),
    []
  );

  // Handle tag provider select. Connect to chain on successful selection.
  const handleOnProviderSelect = (providerUrl: string) => {
    // If auto-renaming is turned on, rename tab to automated name.
    if (autoTabNaming) {
      renameTab(activeTabId, getAutoTabName(chainId));
    }
    // TODO: update tab data and connect to Api instance.
    console.log(providerUrl);
  };

  // Handle tag menu item select. Either add or remove a tag configs.
  const handleOnTagSelect = (tagId: TagId, selected: boolean) => {
    if (selected) {
      removeChainFromTag(tagId, chainId);
    } else {
      addChainToTag(tagId, chainId);
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
                  chainId={chainId}
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
        <h5>{chainId}</h5>
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
                <ConfigTagMenu chainId={chainId} onSelect={handleOnTagSelect} />
              );
            }}
          />
        </div>
      </div>
    </ChainListItemWrapper>
  );
};
