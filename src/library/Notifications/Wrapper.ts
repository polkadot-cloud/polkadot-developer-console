// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const Wrapper = styled.ul`
  position: fixed;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  list-style: none;
  justify-content: flex-end;
  z-index: 12;

  li {
    background: var(--background-primary);
    border: 0.5px solid var(--border-primary-color);
    /* TODO: make theme variable + dark mode support */
    box-shadow:
      0 2px 3px -1px rgba(0, 0, 0, 0.05),
      0 1px 4px -2px rgba(0, 0, 0, 0.05);
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
