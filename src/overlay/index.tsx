// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { OverlayErrorBoundary } from 'library/ErrorBoundaries/OverlayErrorBoundary';
import { Overlay } from 'library/Overlay';

export const Overlays = () => (
  <Overlay
    fallback={OverlayErrorBoundary}
    externalOverlayStatus={
      'closed'
    } /* NOTE: No external overlays are currently in use. */
    modals={{}}
    canvas={{}}
  />
);
