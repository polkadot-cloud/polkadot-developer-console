// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

// A prompt to give instruction relating to the setup.
export const SetupPrompt = styled.div`
  border: 1px solid var(--accent-color-secondary);
  background: var(--background-default);
  border-radius: 0.7rem;
  padding: 0.7rem 0.85rem;
  width: 100%;
  margin-bottom: 1.5rem;
  display: flex;

  > section {
    display: flex;
    flex-direction: column;
    justify-content: center;

    &:first-child {
      padding-right: 0.2rem;
    }

    .info-svg {
      color: var(--accent-color-secondary);
      margin-right: 0.4rem;
    }

    h4 {
      color: var(--accent-color-secondary);
      font-family: InterSemiBold, sans-serif;
      margin: 0;
    }

    a {
      color: var(--accent-color-primary);
      text-decoration: underline;
    }
  }
`;
