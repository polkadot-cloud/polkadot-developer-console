// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ListWrapper } from 'library/ContextMenu/Wrappers';
import { Wrapper } from './Wrapper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useTags } from 'contexts/Tags';
import { useTabs } from 'contexts/Tabs';
import { useChainFilter } from 'contexts/ChainFilter';
import type { TagItem } from 'contexts/Tags/types';

export const TagsMenu = () => {
  const { activeTabId } = useTabs();
  const { tags, getChainsForTag } = useTags();
  const { getAppliedTags, removeTag, applyTags } = useChainFilter();

  const appliedTags = getAppliedTags(activeTabId);

  // Either add or remove a tag to chain filter based on current state.
  const handleToggleTag = ([, tag]: [string, TagItem], selected: boolean) => {
    if (selected) {
      removeTag(activeTabId, tag.name);
    } else {
      applyTags(activeTabId, [...appliedTags, tag.name]);
    }
  };

  return (
    <Wrapper>
      <h5>Select Tags</h5>
      <ListWrapper>
        {Object.entries(tags).map(([id, tag]) => {
          const selected = appliedTags.includes(tag.name);
          const chainCount = getChainsForTag(Number(id))?.length || 0;

          return (
            <li
              key={`tag_context_item_${Number(id)}`}
              className={selected ? ` selected` : undefined}
            >
              <button onClick={() => handleToggleTag([id, tag], selected)} />
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