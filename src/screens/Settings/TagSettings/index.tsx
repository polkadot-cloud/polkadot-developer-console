// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTags } from 'contexts/Tags';
import { TagItemWrapper } from './Wrappers';
import { Tag } from 'library/Tag';
import { HeaderButtonWrapper, SettingsHeaderWrapper } from '../Wrappers';

export const TagSettings = () => {
  const { tags, getChainsForTag } = useTags();

  return (
    <>
      <SettingsHeaderWrapper>
        <h2>Manage Tags</h2>
        <div>
          <HeaderButtonWrapper
            onClick={() => {
              /* Do nothing */
            }}
            disabled
          >
            Revert Changes
          </HeaderButtonWrapper>
        </div>
      </SettingsHeaderWrapper>

      {Object.entries(tags).map(([id, name]) => {
        const chainCount = getChainsForTag(Number(id)).length;

        return (
          <TagItemWrapper key={`tag_${id}`}>
            <div>
              <span className="tag">
                <Tag name={name} />
              </span>
              <h5>
                Applied to {chainCount} {chainCount === 1 ? 'chain' : 'chains'}
              </h5>
            </div>
            <div>
              <button>Edit</button>
            </div>
          </TagItemWrapper>
        );
      })}
    </>
  );
};
