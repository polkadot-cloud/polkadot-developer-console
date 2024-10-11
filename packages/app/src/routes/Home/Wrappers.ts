// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import styled from 'styled-components';

// Outer page wrapper that contains all page content.
export const HomePageWrapper = styled.div`
  flex: 1;

  > h2 {
    display: flex;
    align-items: center;
    line-height: 1.8rem;
  }

  > h3 {
    color: var(--text-color-secondary);
    font-size: 0.98rem;
    margin-bottom: 1.5rem;

    &.subtitle {
      margin-top: 0.5rem;
      margin-bottom: 1rem;
    }
  }
`;

// General purpose form wrapper with limited-width sections and headings.
export const FormWrapper = styled.div`
  flex: 1;

  > h3 {
    font-family: InterSemiBold, sans-serif;
    font-size: 0.95rem;
    margin-bottom: 1.1rem;
  }

  > section {
    flex: 1;
    max-width: 650px;
    margin-bottom: 1rem;

    &.fullWidth {
      max-width: none;
    }
  }
`;
