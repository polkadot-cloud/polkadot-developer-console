// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const CanvasFullScreenWrapper = styled.div`
  padding-top: 3rem;
  min-height: calc(100vh - 12rem);
  padding-bottom: 2rem;
  width: 100%;

  > .head {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  > h1 {
    margin-top: 1.5rem;
    margin-bottom: 1.25rem;
  }
`;
