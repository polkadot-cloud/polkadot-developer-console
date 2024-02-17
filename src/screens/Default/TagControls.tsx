// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { TagControlsWrapper } from './Wrappers';
import { TagControl } from 'library/TagControl';
import { useChainSearch } from 'contexts/ChainSearch';
import { useTabs } from 'contexts/Tabs';

export const TagControls = () => {
  const { activeTabId } = useTabs();
  const { getAppliedTags } = useChainSearch();

  const tags = getAppliedTags(activeTabId);

  return (
    <TagControlsWrapper>
      <div className="controls">
        <h5>Tags</h5>
        <TagControl name="Add" icon={faPlus} />
        <TagControl name="Clear" />
      </div>
      {tags ? (
        <div className="applied">
          {tags.map((tag) => (
            <TagControl key={`applied_tag_${tag}`} name={tag} large />
          ))}
        </div>
      ) : null}
    </TagControlsWrapper>
  );
};
