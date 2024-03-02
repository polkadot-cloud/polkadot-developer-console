// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ListWrapper } from 'library/ContextMenu/Wrappers';
import { Wrapper } from './Wrapper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useTags } from 'contexts/Tags';
import { useTabs } from 'contexts/Tabs';
import { useChainFilter } from 'contexts/ChainFilter';
import type { TagId } from 'contexts/Tags/types';

export const FilterTagMenu = ({
  onSelect,
}: {
  onSelect: (current: string[], tagId: TagId, selected: boolean) => void;
}) => {
  const { activeTabId } = useTabs();
  const { getAppliedTags } = useChainFilter();
  const { tags, getChainsForTag } = useTags();

  const appliedTags = getAppliedTags(activeTabId);
  const appliedTagIds = appliedTags.map(([id]) => id);

  return (
    <Wrapper>
      <h5>Select Tags</h5>
      <ListWrapper>
        {Object.entries(tags).map(([id, tag]) => {
          const selected = !!appliedTags.find(
            ([, { name }]) => name === tag.name
          );
          const chainCount = getChainsForTag(id)?.length || 0;

          return (
            <li
              key={`tag_context_item_${id}`}
              className={selected ? ` selected` : undefined}
            >
              <button onClick={() => onSelect(appliedTagIds, id, selected)} />
              <div className="inner">
                <div>
                  {selected && (
                    <FontAwesomeIcon icon={faCheck} transform="shrink-2" />
                  )}
                </div>
                <div>
                  <h3>{tag.name}</h3>
                </div>
                <div>
                  <h5>{chainCount}</h5>
                </div>
              </div>
            </li>
          );
        })}
      </ListWrapper>
    </Wrapper>
  );
};
