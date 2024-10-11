// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import styled from 'styled-components';

export const Wrapper = styled.ul`
  position: fixed;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  list-style: none;
  justify-content: flex-end;
  z-index: 101;

  li {
    background: var(--background-primary);
    border: 0.5px solid var(--border-primary-color);
    box-shadow: var(--shadow-notification);
    margin: 0.2rem 1rem;
    position: relative;
    border-radius: 0.6rem;
    padding: 0.65rem 0.75rem;
    display: flex;
    flex-flow: column wrap;
    justify-content: center;
    cursor: pointer;
    overflow: hidden;
    width: 375px;

    h3 {
      color: var(--accent-color-primary);
      font-family: InterSemiBold, sans-serif;
      font-size: 0.8rem;
      margin: 0 0 0.3rem;
      flex: 1;
    }
    p {
      color: var(--text-color-secondary);
      font-family: InterSemiBold, sans-serif;
      font-size: 0.76rem;
      line-height: 0.9rem;
      margin: 0;
    }
  }
`;
