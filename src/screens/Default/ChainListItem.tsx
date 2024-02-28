// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Suspense, lazy, useMemo } from 'react';
import { ChainListItemWrapper } from './Wrappers';
import { Tag } from 'library/Tag';
import { useTags } from 'contexts/Tags';
import { TagControl } from 'library/TagControl';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useMenu } from 'contexts/Menu';
import { TagsMenu } from './TagsMenu';
import type { TagItem } from 'contexts/Tags/types';

export interface ChainListItemProps {
  chain: string;
  name: string;
}

export const ChainListItem = ({ chain, name }: ChainListItemProps) => {
  const { openMenu } = useMenu();
  const { getTagsForChain } = useTags();
  const tags = getTagsForChain(chain);

  // Lazily load the icon for the chain.
  const Icon = useMemo(
    () => lazy(() => import(`../../config/networks/icons/${chain}/Inline.tsx`)),
    []
  );

  // Handle tag menu item select. Either add or remove a tag configs.
  const handleOnSelect = (
    current: string[],
    tag: TagItem,
    selected: boolean
  ) => {
    if (selected) {
      console.log('remove tag from chain');
    } else {
      console.log('add tag to chain');
    }
  };

  return (
    <ChainListItemWrapper>
      <div className="header">
        <Suspense fallback={<div />}>
          <div className="icon">
            <Icon />
          </div>
        </Suspense>
        <h3>{name}</h3>
      </div>

      <div className="footer">
        <h5>{chain}</h5>
        <div className="tags">
          {tags.length
            ? tags.map((tag) => <Tag key={`tag_${tag}`} name={tag} />)
            : null}
          <TagControl
            light
            name={'Add'}
            icon={faPlus}
            onClick={(ev) => {
              openMenu(ev, <TagsMenu onSelect={handleOnSelect} />);
              /* Do nothing */
            }}
          />
        </div>
      </div>
    </ChainListItemWrapper>
  );
};
