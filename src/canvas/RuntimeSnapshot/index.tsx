// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { CanvasCardWrapper, CanvasFullScreenWrapper } from 'canvas/Wrappers';
import { ButtonText } from 'library/Buttons/ButtonText';
import { useOverlay } from 'library/Overlay/Provider';

export const RuntimeSnapshot = () => {
  const { closeCanvas } = useOverlay().canvas;

  return (
    <CanvasFullScreenWrapper>
      <div className="head">
        <ButtonText onClick={() => closeCanvas()}>Close</ButtonText>
      </div>

      <h1>Runtime Snapshot</h1>

      <CanvasCardWrapper>
        <h3>Snapshot Details</h3>
      </CanvasCardWrapper>
    </CanvasFullScreenWrapper>
  );
};
