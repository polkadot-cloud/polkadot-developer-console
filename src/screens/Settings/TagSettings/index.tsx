// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTags } from 'contexts/Tags';
import { TagItemWrapper } from './Wrappers';
import { Tag } from 'library/Tag';
import { HeaderButtonWrapper, SettingsHeaderWrapper } from '../Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faPlus } from '@fortawesome/free-solid-svg-icons';

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
          >
            <FontAwesomeIcon icon={faPlus} transform="shrink-1" />
            New Tag
          </HeaderButtonWrapper>
        </div>
      </SettingsHeaderWrapper>

      {Object.entries(tags).map(([id, { name, locked }]) => {
        const chainCount = getChainsForTag(Number(id)).length;

        return (
          <TagItemWrapper key={`tag_${id}`}>
            <div className="details">
              <span className="tag">
                <Tag name={name} large />
              </span>
              <h5>
                Applied to {chainCount} {chainCount === 1 ? 'chain' : 'chains'}
              </h5>
            </div>
            <div className="controls">
              {locked && (
                <FontAwesomeIcon
                  icon={faLock}
                  transform="shrink-4"
                  className="lock"
                />
              )}
              {!locked && <button disabled={locked}>Edit</button>}
            </div>
          </TagItemWrapper>
        );
      })}
    </>
  );
};
