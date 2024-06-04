// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faBug } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Wrapper } from './Wrapper';

export const AppErrorBoundary = ({
  resetErrorBoundary,
}: {
  resetErrorBoundary?: () => void;
}) => (
  <Wrapper>
    <h3>
      <FontAwesomeIcon icon={faBug} transform="grow-25" />
    </h3>
    <h1>Oops, Something Went Wrong</h1>
    <h2>
      <button
        type="button"
        onClick={() => resetErrorBoundary && resetErrorBoundary()}
      >
        Click to Reload Developer Console
      </button>
    </h2>
  </Wrapper>
);
