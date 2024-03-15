// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { HeaderToggleWrapper } from 'library/HeaderToggle/Wrapper';

export const Header = () => {
  // TODO: move into context.
  const activeChainState = 'storage';

  return (
    <HeaderToggleWrapper>
      <h5>Query from:</h5>
      <button
        className={activeChainState === 'storage' ? 'active' : undefined}
        onClick={() => {
          /* TOOO: implement */
        }}
      >
        Storage Items
      </button>
      <button
        className={undefined}
        onClick={() => {
          /* TOOO: implement */
        }}
      >
        Runtime Constants
      </button>
      <button
        className={undefined}
        onClick={() => {
          /* TOOO: implement */
        }}
      >
        Raw Storage
      </button>
    </HeaderToggleWrapper>
  );
};
