// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { TagControlsWrapper } from '../Wrappers';
import { TagControl } from 'library/TagControl';
import { useChainFilter } from 'contexts/ChainFilter';
import { useMenu } from 'contexts/Menu';
import { FilterTagMenu } from './TagsMenu/FilterTagMenu';
import type { TagId } from 'contexts/Tags/types';
import { useActiveTab } from 'contexts/ActiveTab';
import { faPlus } from '@fortawesome/pro-duotone-svg-icons';
import { faClose } from '@fortawesome/free-solid-svg-icons';

export const TagControls = () => {
  const { openMenu } = useMenu();
  const { tabId } = useActiveTab();
  const { getAppliedTags, applyTags, removeAppliedTag } = useChainFilter();

  const appliedTags = getAppliedTags(tabId);

  // Handle tag menu item select. Either add or remove a tag to chain filter based on current state.
  const handleOnSelect = (
    tagId: TagId,
    selected: boolean,
    current: string[]
  ) => {
    if (selected) {
      removeAppliedTag(tabId, tagId);
    } else {
      applyTags(tabId, [...current, tagId]);
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
        <TagControl name="Clear" onClick={() => applyTags(tabId, [])} />
      </div>
      {appliedTags ? (
        <div className="applied">
          {appliedTags.map(([tagId, { name }]) => (
            <TagControl
              key={`applied_tag_${tagId}`}
              name={name}
              icon={faClose}
              large
              onClick={() => removeAppliedTag(tabId, tagId)}
            />
          ))}
        </div>
      ) : null}
    </TagControlsWrapper>
  );
};
