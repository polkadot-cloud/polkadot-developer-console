// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

// Outer page wrapper that contains all page content.
export const HomePageWrapper = styled.div`
  flex: 1;
  padding: 0 1rem;

  h2 {
    display: flex;
    align-items: center;
    line-height: 1.8rem;

    > .icon {
      margin-left: 0.6rem;
      width: 1.7rem;
      height: 1.7rem;
      padding: 0.2rem;
      transition: opacity 0.2s;

      > div {
        width: 100%;
        height: 100%;
        position: relative;

        > svg {
          fill: var(--accent-color-primary);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  h3 {
    color: var(--text-color-secondary);
    font-size: 0.98rem;
    margin-bottom: 1.5rem;
  }
`;

// General purpose form wrapper with limited-width sections and headings.
export const FormWrapper = styled.div`
  flex: 1;
  margin-top: 1rem;

  > section {
    flex: 1;
    max-width: 650px;
    margin-bottom: 1rem;

    &.fullWidth {
      max-width: none;
    }

    > h4 {
      margin-bottom: 0.2rem;
    }
  }
`;
