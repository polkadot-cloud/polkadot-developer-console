// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Wrapper } from './Wrapper';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';

export const ChainMenu = () => (
  <Wrapper>
    <div className="menu">
      <div>Not Connected</div>
    </div>
    <div className="config">
      <FontAwesomeIcon icon={faAngleUp} transform="shrink-3" className="icon" />
    </div>
  </Wrapper>
);
