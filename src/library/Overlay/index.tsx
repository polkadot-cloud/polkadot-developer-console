// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { OverlayProps } from './Provider/types';
import { Modal } from './Modal';
import { Canvas } from './Canvas';
import { Background } from './Background';

export const Overlay = ({
  modals = {},
  canvas = {},
  fallback,
  externalOverlayStatus,
}: OverlayProps) => (
  <>
    <Background externalOverlayStatus={externalOverlayStatus} />
    <Modal
      fallback={fallback}
      modals={modals}
      externalOverlayStatus={externalOverlayStatus}
    />
    <Canvas
      fallback={fallback}
      canvas={canvas}
      externalOverlayStatus={externalOverlayStatus}
    />
  </>
);
