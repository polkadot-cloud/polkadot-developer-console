// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FooterWrapper } from './Wrappers';
import { faHive } from '@fortawesome/free-brands-svg-icons';

export const Footer = () => (
  <FooterWrapper>
    <div>Connected</div>
    <div>
      <FontAwesomeIcon icon={faHive} className="icon" />
      &nbsp; 1,234,567
    </div>
  </FooterWrapper>
);
