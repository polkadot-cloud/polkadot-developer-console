// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Suspense, lazy, useMemo } from 'react';
import { SelectOptionWrapper } from '../Wrappers';
import { Tag } from 'library/Tag';
import { useTags } from 'contexts/Tags';
import { TagControl } from 'library/TagControl';
import { faCircleRight, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useMenu } from 'contexts/Menu';
import { ConfigTagMenu } from './TagsMenu/ConfigTagMenu';
import type { TagId } from 'contexts/Tags/types';
import { type DirectoryId } from 'config/networks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTabs } from 'contexts/Tabs';
import { ButtonSubmit } from 'library/Buttons/ButtonSubmit';
import { useActiveTab } from 'contexts/ActiveTab';
import { ConnectContextMenu } from 'library/ConnectContextMenu';

export interface ChainListItemProps {
  chainId: DirectoryId;
  name: string;
}

export const ChainListItem = ({ chainId, name }: ChainListItemProps) => {
  const { connectTab } = useTabs();
  const { tabId } = useActiveTab();
  const { openMenu, closeMenu } = useMenu();
  const { tags, getTagsForChain, addChainToTag, removeChainFromTag } =
    useTags();

  const chainTags = getTagsForChain(chainId);

  // Lazily load the icon for the chain.
  const Icon = useMemo(
    () =>
      lazy(
        () => import(`../../../../config/networks/icons/${chainId}/Inline.tsx`)
      ),
    []
  );

  // Handle tag provider select. Connect to chain on successful selection.
  const handleOnProviderSelect = (endpoint: string) => {
    // Update tab data and connect to Api instance.
    connectTab(tabId, chainId, endpoint);
    // Close menu.
    closeMenu();
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
    <SelectOptionWrapper>
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
          <ButtonSubmit
            onClick={(ev) => {
              openMenu(
                ev,
                <ConnectContextMenu
                  chainId={chainId}
                  onSelect={handleOnProviderSelect}
                />
              );
            }}
          >
            Connect
            <FontAwesomeIcon
              icon={faCircleRight}
              transform="shrink-1"
              className="iconRight"
            />
          </ButtonSubmit>
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
    </SelectOptionWrapper>
  );
};
