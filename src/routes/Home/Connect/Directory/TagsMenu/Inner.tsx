// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { TagId, TagItem } from 'contexts/Tags/types';
import {
  ListWrapper,
  SearchWrapper,
  SelectListWrapper,
} from 'library/ContextMenu/Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faLock } from '@fortawesome/free-solid-svg-icons';
import { useTags } from 'contexts/Tags';
import { formatInputString } from 'Utils';
import { SearchInput } from 'library/ContextMenu/SearchInput';
import { useRef } from 'react';

export const TagsMenuInner = ({
  tagEntries,
  appliedTags,
  tagSearchTerm,
  setTagSearchTerm,
  onSelect,
  handleOnChange,
  selectLocked,
}: {
  tagEntries: [string, TagItem][];
  appliedTags: string[];
  tagSearchTerm: string;
  setTagSearchTerm: (value: string) => void;
  onSelect: (tagId: TagId, selected: boolean, current: string[]) => void;
  handleOnChange: (value: string) => void;
  selectLocked: boolean;
}) => {
  const { getChainsForTag } = useTags();

  // Filter tags based on provided search term, if present.
  const filteredTags =
    tagSearchTerm !== ''
      ? tagEntries.filter(([, { name }]) =>
          name.toLowerCase().includes(formatInputString(tagSearchTerm, true))
        )
      : tagEntries;

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <SelectListWrapper>
      <h5>Select Tags</h5>
      <SearchWrapper className="bg">
        <SearchInput
          inputRef={inputRef}
          value={tagSearchTerm}
          searchValue={tagSearchTerm}
          setSearchValue={setTagSearchTerm}
          onChange={(ev) => handleOnChange(ev.currentTarget.value)}
          onEnter={() => {
            /* Do nothing */
          }}
          onEscape={() => {
            /* Do nothing */
          }}
        />
      </SearchWrapper>
      <ListWrapper>
        {filteredTags.map(([id, tag]) => {
          const selected = appliedTags.includes(id);
          const chainCount = getChainsForTag(id)?.length || 0;
          const locked = !selectLocked && tag.locked;

          return (
            <li
              key={`tag_context_item_${id}`}
              className={`${selected ? ` selected` : ``}${locked ? ` disabled` : ``}`}
            >
              <button
                disabled={locked}
                onClick={() => onSelect(id, selected, appliedTags)}
              />

              <div className="inner">
                <div>
                  {locked ? (
                    <FontAwesomeIcon icon={faLock} transform="shrink-5" />
                  ) : (
                    selected && (
                      <FontAwesomeIcon icon={faCheck} transform="shrink-2" />
                    )
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
    </SelectListWrapper>
  );
};
