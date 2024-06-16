// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { HeaderToggleWrapper } from 'library/HeaderToggle/Wrapper';

export const Header = () => (
  <HeaderToggleWrapper>
    <button type="button" className={'active'}>
      Submit Extrinsic
    </button>
  </HeaderToggleWrapper>
);
