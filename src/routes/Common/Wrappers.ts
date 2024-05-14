// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const FlexWrapper = styled.div`
  flex: 1;
  padding: 0 0.5rem;
`;

export const StickyMenu = styled.div`
  background-color: var(--background-default);
  position: sticky;
  z-index: 10;
  top: calc(5.02rem);
  transition: top 0.15s;

  &.tabsHidden {
    top: calc(2.52rem);
  }
`;
