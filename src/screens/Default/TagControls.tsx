// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faClose, faPlus } from '@fortawesome/free-solid-svg-icons';
import { TagControlsWrapper } from './Wrappers';
import { TagControl } from 'library/TagControl';
import { useChainFilter } from 'contexts/ChainFilter';
import { useTabs } from 'contexts/Tabs';
import { useMenu } from 'contexts/Menu';
import { TagsMenu } from './TagsMenu';

export const TagControls = () => {
  const { activeTabId } = useTabs();
  const { openMenu } = useMenu();
  const { getAppliedTags, applyTags, removeTag } = useChainFilter();

  const tags = getAppliedTags(activeTabId);

  return (
    <TagControlsWrapper>
      <div className="controls">
        <h5>Tags</h5>
        <TagControl
          name="Add"
          icon={faPlus}
          onClick={(ev) => openMenu(ev, <TagsMenu />)}
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
