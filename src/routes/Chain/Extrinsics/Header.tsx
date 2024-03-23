// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { HeaderToggleWrapper } from 'library/HeaderToggle/Wrapper';

export const Header = () => (
  <HeaderToggleWrapper>
    <button className={'active'}>Submit Extrinsic</button>
  </HeaderToggleWrapper>
);