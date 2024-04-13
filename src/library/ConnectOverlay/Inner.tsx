// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faExternalLinkAlt, faPlug } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ItemWrapper } from './Wrappers';
import PolkadotVaultSVG from '@w3ux/extension-assets/PolkadotVault.svg?react';
import LedgerSquareSVG from '@w3ux/extension-assets/LedgerSquare.svg?react';

export const ConnectInner = () => (
  <>
    <h3>
      <FontAwesomeIcon icon={faPlug} transform="shrink-2" />
      Connect Wallets
    </h3>

    <h4>Hardware</h4>
    <ItemWrapper>
      <div>
        <PolkadotVaultSVG className="icon" />
      </div>
      <div>
        <div>
          <h4>Polkadot Vault</h4>
          <h5>
            <a href="https://signer/parity.io" target="_blank" rel="noreferrer">
              signer.parity.io
              <FontAwesomeIcon icon={faExternalLinkAlt} transform="shrink-5" />
            </a>
          </h5>
        </div>
        <div>
          <button>Manage</button>
        </div>
      </div>
    </ItemWrapper>
    <ItemWrapper>
      <div>
        <LedgerSquareSVG style={{ width: '1.4rem', height: '1.4rem' }} />
      </div>
      <div>
        <div>
          <h4>Ledger</h4>
          <h5>
            <a href="https://ledger.com" target="_blank" rel="noreferrer">
              ledger.com
              <FontAwesomeIcon icon={faExternalLinkAlt} transform="shrink-5" />
            </a>
          </h5>
        </div>
        <div>
          <button>Manage</button>
        </div>
      </div>
    </ItemWrapper>

    <h4>Web Extensions</h4>
    <ItemWrapper></ItemWrapper>
    <ItemWrapper></ItemWrapper>
    <ItemWrapper></ItemWrapper>
    <ItemWrapper></ItemWrapper>
    <ItemWrapper></ItemWrapper>
    <ItemWrapper></ItemWrapper>
    <ItemWrapper></ItemWrapper>
    <ItemWrapper></ItemWrapper>
  </>
);
