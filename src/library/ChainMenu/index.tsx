// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonWrapper, ChainManuWrapper } from './Wrappers';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';

export const ChainMenu = () => (
  <ChainManuWrapper>
    <div className="menu">
      <div>Not Connected</div>
    </div>
    <div className="config">
      <ButtonWrapper
        onClick={() => {
          /* Do nothing */
        }}
        className="action"
      >
        <FontAwesomeIcon icon={faAngleUp} transform="shrink-3" />
      </ButtonWrapper>
    </div>
  </ChainManuWrapper>
);
