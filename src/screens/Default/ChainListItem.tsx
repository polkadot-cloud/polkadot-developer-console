// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Suspense, lazy, useMemo } from 'react';
import { ChainListItemWrapper } from './Wrappers';
import { Tag } from 'library/Tag';
import { useTags } from 'contexts/Tags';
import { TagControl } from 'library/TagControl';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export interface ChainListItemProps {
  chain: string;
  name: string;
}

export const ChainListItem = ({ chain, name }: ChainListItemProps) => {
  const { getTagsForChain } = useTags();
  const tags = getTagsForChain(chain);

  // Lazily load the icon for the chain.
  const Icon = useMemo(
    () => lazy(() => import(`../../config/networks/icons/${chain}/Inline.tsx`)),
    []
  );

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
            onClick={() => {
              /* Do nothing */
            }}
          />
        </div>
      </div>
    </ChainListItemWrapper>
  );
};
