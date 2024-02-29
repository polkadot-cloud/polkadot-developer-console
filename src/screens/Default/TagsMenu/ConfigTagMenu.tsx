// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ListWrapper } from 'library/ContextMenu/Wrappers';
import { Wrapper } from './Wrapper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faLock } from '@fortawesome/free-solid-svg-icons';
import { useTags } from 'contexts/Tags';

export const ConfigTagMenu = ({
  onSelect,
  chainId,
}: {
  onSelect: (tag: string, selected: boolean) => void;
  chainId: string;
}) => {
  const { tags, getChainsForTag, getTagsForChain } = useTags();

  const appliedTags = getTagsForChain(chainId);

  // Re-order tags so locked tags appear last.
  const orderedEntries = Object.entries(tags).sort(
    ([, a], [, b]) => Number(a.locked) - Number(b.locked)
  );

  return (
    <Wrapper>
      <h5>Select Tags</h5>
      <ListWrapper>
        {orderedEntries.map(([id, tag]) => {
          const selected = appliedTags.includes(tag.name);
          const chainCount = getChainsForTag(id)?.length || 0;

          return (
            <li
              key={`tag_context_item_${id}`}
              className={`${selected ? ` selected` : ``}${tag.locked ? ` disabled` : ``}`}
            >
              <button
                disabled={tag.locked}
                onClick={() => onSelect(id, selected)}
              />
              <div className="inner">
                <div>
                  {tag.locked ? (
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
    </Wrapper>
  );
};
