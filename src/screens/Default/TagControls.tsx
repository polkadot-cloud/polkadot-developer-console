// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faClose, faPlus } from '@fortawesome/free-solid-svg-icons';
import { TagControlsWrapper } from './Wrappers';
import { TagControl } from 'library/TagControl';
import { useChainFilter } from 'contexts/ChainFilter';
import { useTabs } from 'contexts/Tabs';
import { useMenu } from 'contexts/Menu';
import { TagsMenu } from './TagsMenu';
import type { TagItem } from 'contexts/Tags/types';

export const TagControls = () => {
  const { openMenu } = useMenu();
  const { activeTabId } = useTabs();
  const { getAppliedTags, applyTags, removeTag } = useChainFilter();

  const tags = getAppliedTags(activeTabId);

  // Handle tag menu item select. Either add or remove a tag to chain filter based on current state.
  const handleOnSelect = (
    current: string[],
    tag: TagItem,
    selected: boolean
  ) => {
    if (selected) {
      removeTag(activeTabId, tag.name);
    } else {
      applyTags(activeTabId, [...current, tag.name]);
    }
  };

  return (
    <TagControlsWrapper>
      <div className="controls">
        <h5>Tags</h5>
        <TagControl
          name="Add"
          icon={faPlus}
          onClick={(ev) => openMenu(ev, <TagsMenu onSelect={handleOnSelect} />)}
        />
        <TagControl name="Clear" onClick={() => applyTags(activeTabId, [])} />
      </div>
      {tags ? (
        <div className="applied">
          {tags.map((tag) => (
            <TagControl
              key={`applied_tag_${tag}`}
              name={tag}
              icon={faClose}
              large
              onClick={() => removeTag(activeTabId, tag)}
            />
          ))}
        </div>
      ) : null}
    </TagControlsWrapper>
  );
};
