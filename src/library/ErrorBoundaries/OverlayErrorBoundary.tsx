// Copyright 2024 @polkadot-cloud/developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { FC } from 'react';
import { Wrapper } from './Wrapper';

interface ErrorFallbackProps {
  resetErrorBoundary?: () => void;
}

export const OverlayErrorBoundary: FC = (props: ErrorFallbackProps) => {
  const { resetErrorBoundary } = props;

  return (
    <Wrapper className="modal">
      <h2>An Unknown Error Occured</h2>
      <h4>
        <button
          type="button"
          onClick={() => resetErrorBoundary && resetErrorBoundary()}
        >
          Reload
        </button>
      </h4>
    </Wrapper>
  );
};
