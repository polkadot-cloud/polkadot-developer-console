// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import ConnectedSVG from 'svg/Connected.svg?react';
import { FlexWrapper } from 'routes/Common/Wrappers';
import { StatsWrapper } from './Wrappers';

export const Preload = () => (
  <>
    <FlexWrapper>
      <h2>Fetching Chain Spec...</h2>
    </FlexWrapper>

    <StatsWrapper className="vSpace">
      <div className="active shimmer">
        <ConnectedSVG className="icon" /> Loading ...
      </div>
    </StatsWrapper>
  </>
);
