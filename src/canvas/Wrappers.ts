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
    font-family: InterBold, sans-serif;
    font-size: 1.2rem;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
  }
`;

export const CanvasCardWrapper = styled.div`
  padding: 1rem 1rem;
  border-radius: 0.65rem;
  background-color: var(--background-canvas-card);
  box-shadow: var(--shadow-card);
  margin: 1rem 0;
  width: 100%;

  h2 {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  h3 {
    margin: 0;
  }
`;

export const CanvasSubheading = styled.h3`
  border-bottom: 1px solid var(--border-tertiary-color);
  color: var(--text-primary-color);
  padding: 0.65rem 0.25rem;
  display: flex;
  align-items: center;

  > button {
    color: var(--text-color-primary);
    font-family: InterSemiBold, sans-serif;
    font-size: 0.85rem;

    &:hover {
      color: var(--text-color-secondary);
    }
  }

  > span {
    display: flex;
    justify-content: center;
    margin-right: 0.15rem;
    width: 1rem;
  }
`;
