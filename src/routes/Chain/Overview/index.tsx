// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { NetworkDirectory } from 'config/networks';
import { isDirectoryId } from 'config/networks/Utils';
import { useApi } from 'contexts/Api';
import { useTabs } from 'contexts/Tabs';
import { CardsWrapper, Wrapper } from './Wrappers';
import ConnectedSVG from 'svg/Connected.svg?react';
import Odometer from '@w3ux/react-odometer';
import BigNumber from 'bignumber.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHive } from '@fortawesome/free-brands-svg-icons';
import { faList } from '@fortawesome/free-solid-svg-icons';
import { base58Decode, base58Encode } from '@polkadot/util-crypto';
import { u8aToHex, u8aToNumber } from '@polkadot/util';

export const Overview = () => {
  const { getApiStatus, getChainSpec } = useApi();
  const { getActiveTab, activeTabId } = useTabs();

  const apiStatus = getApiStatus(activeTabId);
  const chainSpec = getChainSpec(activeTabId);
  const chainSpecReady = !!chainSpec;

  const decoded = base58Decode(
    '1hYiMW8KSfUYChzCQSPGXvMSyKVqmyvMXqohjKr3oU5PCXF'
  );
  const decodedHex = u8aToHex(decoded);

  const ss58 = u8aToNumber(decoded.subarray(0, 1));
  const publicKey = u8aToHex(decoded.subarray(2));

  console.log('full hex: ', decodedHex);
  console.log('ss58 prefix: ', ss58);
  console.log('public key: ', publicKey);

  const encodedKey = base58Encode(decoded);
  console.log('encoding back: ', encodedKey);

  // NOTE: we know for certain there is an active tab and an associated API instance here, so we can
  // safely use the non-null assertion.
  const chainId = getActiveTab()!.chain!.id;
  const isDirectory = isDirectoryId(chainId);
  const chainSpecChain = chainSpec?.chain || 'Unknown';

  // Determine chain name based on chain spec.
  let displayName;
  if (isDirectory) {
    // Display directory name if the chain name matches that of directory.
    const match = NetworkDirectory[chainId].system?.chain === chainSpec?.chain;
    displayName = match ? NetworkDirectory[chainId].name : chainSpecChain;
  } else {
    // Custom endpoint: Default to chain spec chain name or 'Unknown' otherwise.
    displayName = chainSpecChain;
  }

  // Whether this component is still syncing.
  const syncing = !chainSpecReady;

  // The current block number.
  // TODO: Replace with actual block number.
  const blockNumber = new BigNumber(syncing ? '0' : '1000000');

  return (
    <Wrapper>
      <h2>
        {!chainSpecReady && apiStatus === 'connecting'
          ? 'Connecting...'
          : chainSpecReady
            ? displayName
            : 'Fetching Chain Spec...'}
      </h2>

      <div className="stats">
        <div className={`active${syncing ? ` shimmer` : ``}`}>
          <ConnectedSVG className="icon" />{' '}
          {apiStatus === 'connecting'
            ? 'Connecting...'
            : chainSpecReady
              ? `Connected to ${chainSpec.chain}`
              : 'Loading ...'}
        </div>
        {chainSpecReady ? (
          <>
            <div>
              <span>Spec Name:</span>
              {chainSpec.version.specName}
            </div>
            <div>
              <span>Runtime Version:</span>
              {chainSpec.version.specVersion}
            </div>
          </>
        ) : (
          ''
        )}
      </div>
      <CardsWrapper>
        <section>
          <div className="inner">
            <h4>
              <FontAwesomeIcon icon={faHive} transform="shrink-3" />
              Latest Block
            </h4>
            <h3 className={chainSpecReady ? undefined : 'shimmer syncing'}>
              <Odometer value={blockNumber.toFormat()} />
            </h3>
          </div>
        </section>
        <section>
          <div className="inner">
            <h4>
              <FontAwesomeIcon icon={faList} transform="shrink-3" /> Runtime
              Snapshot
            </h4>
            <h3>...</h3>
          </div>
        </section>
      </CardsWrapper>
    </Wrapper>
  );
};
