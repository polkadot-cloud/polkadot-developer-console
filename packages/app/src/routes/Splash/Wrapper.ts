// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 20vh;

  /*  full height - header - tab menu - spacing */
  height: calc(100vh - 2.4rem - 2rem - 0.75rem);
  max-width: 750px;
  width: 100%;

  > section {
    display: flex;
    flex-direction: column;
    place-items: center;
    position: relative;

    > .icon {
      opacity: 0.05;
      margin-bottom: 1.5rem;
      width: 10rem;
      height: 10rem;
    }

    > h2 {
      color: var(--text-color-tertiary);
      font-size: 1.1rem;
      margin-bottom: 0.7rem;
    }

    > button {
      color: var(--text-color-primary);
      font-family: InterBold, sans-serif;
      font-size: 0.9rem;
    }
  }
`;
