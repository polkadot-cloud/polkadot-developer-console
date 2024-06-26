// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Suspense, lazy, useMemo } from 'react';
import { ChainItemWrapper } from '../Wrappers';
import { Tag } from 'library/Tag';
import { useTags } from 'contexts/Tags';
import { TagControl } from 'library/TagControl';
import { useMenu } from 'contexts/Menu';
import { ConfigTagMenu } from './TagsMenu/ConfigTagMenu';
import type { TagId } from 'contexts/Tags/types';
import { type DirectoryId } from 'config/networks/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonText } from 'library/Buttons/ButtonText';
import { useActiveTab } from 'contexts/ActiveTab';
import { ConnectContextMenu } from 'library/ConnectContextMenu';
import {
  faArrowRightFromLine,
  faHashtag,
  faPlus,
} from '@fortawesome/pro-duotone-svg-icons';
import { useChainExplorer } from 'contexts/ChainExplorer';
import { getChainInitial, getRelayChain } from 'config/networks/Utils';

export interface ChainDirectoryItemProps {
  chainId: DirectoryId;
  name: string;
}

export const ChainDirectoryItem = ({
  chainId,
  name,
}: ChainDirectoryItemProps) => {
  const { tabId } = useActiveTab();
  const { openMenu, closeMenu } = useMenu();
  const { connectChainExplorer } = useChainExplorer();
  const { tags, getTagsForChain, addChainToTag, removeChainFromTag } =
    useTags();

  const chainTags = getTagsForChain(chainId);

  // Get any relay chain this chain is registered with.
  const relayId = getRelayChain(chainId);

  // Get the assigned chain initial, if any.
  const chainInitial = getChainInitial(chainId);

  // If a relay chain entry exists, use that as icon key, otherwise, use chainId.
  const primaryIconKey = relayId ? relayId : chainId;

  // Lazily load the icon for the chain.
  const PrimaryIcon = useMemo(
    () =>
      lazy(
        () =>
          import(
            `../../../../config/networks/icons/${primaryIconKey}/Inline.tsx`
          )
      ),
    []
  );

  // If relay chain is different from icon, lazily load the icon, otherwise lazy load the same as
  // the primary icon. (This is a React workaround it is not possible to conditionally memoize a
  // lazily loaded component. Could explore child component for secondary icon).
  const secondaryIconKey = chainInitial || primaryIconKey;
  const SecondaryIcon = useMemo(
    () =>
      lazy(
        () =>
          import(
            `../../../../config/networks/icons/${secondaryIconKey}/Inline.tsx`
          )
      ),
    [chainId]
  );

  // Handle tag provider select. Connect to chain on successful selection.
  const handleOnProviderSelect = (endpoint: string) => {
    // Update tab data and connect to Api instance.
    connectChainExplorer(tabId, chainId, endpoint);
    // Close menu.
    closeMenu();
  };

  // Handle tag menu item select. Either add or remove a tag configs.
  const handleOnTagSelect = (tagId: TagId, selected: boolean) => {
    if (selected) {
      removeChainFromTag(tagId, chainId);
    } else {
      addChainToTag(tagId, chainId);
    }
  };

  return (
    <ChainItemWrapper>
      <div className="header">
        <section>
          <Suspense fallback={<div />}>
            <div className={`icon${relayId ? ' hasSecondary' : ''}`}>
              <div className="primary">
                <PrimaryIcon />
              </div>
              {relayId ? (
                <div className={`secondary${chainInitial ? ` initial` : ``}`}>
                  {chainInitial || <SecondaryIcon />}
                </div>
              ) : null}
            </div>
          </Suspense>
          <h3>{name}</h3>
        </section>
        <section>
          <ButtonText
            onClick={(ev) => {
              openMenu(
                ev,
                <ConnectContextMenu
                  chainId={chainId}
                  onSelect={handleOnProviderSelect}
                />
              );
            }}
          >
            Connect
            <FontAwesomeIcon
              icon={faArrowRightFromLine}
              transform="grow-0"
              className="iconRight"
            />
          </ButtonText>
        </section>
      </div>

      <div className="body">
        <h5>
          <FontAwesomeIcon icon={faHashtag} transform="shrink-2" />
          {chainId}
        </h5>
      </div>

      <div className="footer">
        <div className="tags">
          {chainTags.length
            ? chainTags.map((tag) => (
                <Tag key={`tag_${tag}`} name={tags[tag].name} />
              ))
            : null}
          <TagControl
            light
            name={'Add'}
            icon={faPlus}
            onClick={(ev) => {
              openMenu(
                ev,
                <ConfigTagMenu chainId={chainId} onSelect={handleOnTagSelect} />
              );
            }}
          />
        </div>
      </div>
    </ChainItemWrapper>
  );
};
