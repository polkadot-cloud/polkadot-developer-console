// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import styled from 'styled-components';

export const FlexWrapper = styled.div`
  flex: 1;
  padding: 0 0.5rem;
`;

export const StickyMenu = styled.div`
  background-color: var(--background-default);
  position: sticky;
  z-index: 10;
  top: calc(4.5rem);
  transition: top 0.15s;

  &.tabsHidden {
    top: calc(2.15rem);
  }
`;
