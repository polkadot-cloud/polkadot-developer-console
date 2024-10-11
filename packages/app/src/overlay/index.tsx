// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { OverlayErrorBoundary } from 'library/ErrorBoundaries/OverlayErrorBoundary';
import { Overlay } from 'library/Overlay';
import { Transfer } from 'modals/Transfer';
import { RuntimeSnapshot } from 'canvas/RuntimeSnapshot';

export const Overlays = () => (
  <Overlay
    fallback={OverlayErrorBoundary}
    externalOverlayStatus={
      'closed'
    } /* NOTE: No external overlays are currently in use. */
    modals={{
      Transfer,
    }}
    canvas={{
      RuntimeSnapshot,
    }}
  />
);
