// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import ConnectedSVG from 'svg/Connected.svg?react';
import { FlexWrapper, StatsWrapper } from '../Wrappers';

export const Accounts = () => (
  <FlexWrapper>
    <StatsWrapper>
      <div className="active">
        <ConnectedSVG className="icon" /> 2 Accounts Imported
      </div>
    </StatsWrapper>
  </FlexWrapper>
);
