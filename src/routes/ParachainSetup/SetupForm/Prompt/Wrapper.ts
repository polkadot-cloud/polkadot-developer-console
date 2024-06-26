// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

// A prompt to give instruction relating to the setup.
export const SetupPrompt = styled.div`
  border: 1px solid var(--border-primary-color);
  background: var(--background-default);
  border-radius: 0.5rem;
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
      color: var(--text-color-tertiary);
      margin-right: 0.4rem;
    }

    > h4 {
      color: var(--text-color-secondary);
      font-family: InterSemiBold, sans-serif;
      margin: 0;
    }
  }
`;
