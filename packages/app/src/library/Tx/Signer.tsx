// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { faPenToSquare, faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { SignerProps } from './types';
import { SignerWrapper } from './Wrapper';

export const Signer = ({
  dangerMessage,
  notEnoughFunds,
  name,
  label,
}: SignerProps) => (
  <SignerWrapper>
    <span className="badge">
      <FontAwesomeIcon icon={faPenToSquare} className="icon" />
      {label}
    </span>
    {name}
    {notEnoughFunds && (
      <span className="not-enough">
        / &nbsp;
        <FontAwesomeIcon
          icon={faWarning}
          className="danger icon"
          transform="shrink-1"
        />
        <span className="danger">{dangerMessage}</span>
      </span>
    )}
  </SignerWrapper>
);
