// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  CanvasCardWrapper,
  CanvasFullScreenWrapper,
  CanvasSubheading,
} from 'canvas/Wrappers';
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
        <h2>Pallets</h2>

        {/* TODO: iterate pallets and display items */}

        <CanvasSubheading>
          <FontAwesomeIcon icon={faChevronRight} transform="shrink-4" />
          Storage Items
        </CanvasSubheading>

        <CanvasSubheading>
          <FontAwesomeIcon icon={faChevronRight} transform="shrink-4" />
          Constants
        </CanvasSubheading>

        <CanvasSubheading>
          <FontAwesomeIcon icon={faChevronRight} transform="shrink-4" />
          Errors
        </CanvasSubheading>

        <CanvasSubheading>
          <FontAwesomeIcon icon={faChevronRight} transform="shrink-4" />
          Events
        </CanvasSubheading>
      </CanvasCardWrapper>
    </CanvasFullScreenWrapper>
  );
};
