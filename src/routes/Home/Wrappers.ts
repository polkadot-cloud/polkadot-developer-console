// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

// Outer page wrapper that contains all page content.
export const HomePageWrapper = styled.div`
  flex: 1;
  padding: 0 0.5rem;

  h2 {
    display: flex;
    align-items: center;
    line-height: 1.8rem;
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

  > h3 {
    margin-bottom: 1rem;
  }

  > section {
    flex: 1;
    max-width: 650px;
    margin-bottom: 1rem;

    &.fullWidth {
      max-width: none;
    }

    > h4 {
      margin-bottom: 0.2rem;

      &.note {
        color: var(--text-color-secondary);
        font-family: InterSemiBold, sans-serif;
        margin: 1.5rem 0 0.5rem 0;

        > .icon {
          margin-right: 0.35rem;
        }
      }
    }
  }
`;
