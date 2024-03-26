// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faClose, faPlus } from '@fortawesome/free-solid-svg-icons';
import { TagControlsWrapper } from '../Wrappers';
import { TagControl } from 'library/TagControl';
import { useChainFilter } from 'contexts/ChainFilter';
import { useMenu } from 'contexts/Menu';
import { FilterTagMenu } from './TagsMenu/FilterTagMenu';
import type { TagId } from 'contexts/Tags/types';
import { useActiveTabId } from 'contexts/ActiveTab';

export const TagControls = () => {
  const { openMenu } = useMenu();
  const activeTabId = useActiveTabId();
  const { getAppliedTags, applyTags, removeAppliedTag } = useChainFilter();

  const appliedTags = getAppliedTags(activeTabId);

  // Handle tag menu item select. Either add or remove a tag to chain filter based on current state.
  const handleOnSelect = (
    tagId: TagId,
    selected: boolean,
    current: string[]
  ) => {
    if (selected) {
      removeAppliedTag(activeTabId, tagId);
    } else {
      applyTags(activeTabId, [...current, tagId]);
    }
  };

  return (
    <TagControlsWrapper>
      <div className="controls">
        <h5>Tags</h5>
        <TagControl
          name="Add"
          icon={faPlus}
          onClick={(ev) =>
            openMenu(ev, <FilterTagMenu onSelect={handleOnSelect} />)
          }
        />
        <TagControl name="Clear" onClick={() => applyTags(activeTabId, [])} />
      </div>
      {appliedTags ? (
        <div className="applied">
          {appliedTags.map(([tagId, { name }]) => (
            <TagControl
              key={`applied_tag_${tagId}`}
              name={name}
              icon={faClose}
              large
              onClick={() => removeAppliedTag(activeTabId, tagId)}
            />
          ))}
        </div>
      ) : null}
    </TagControlsWrapper>
  );
};
