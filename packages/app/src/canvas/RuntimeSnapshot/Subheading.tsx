// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import {
  faChevronDown,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CanvasSubheading } from 'canvas/Wrappers';
import type { SubheadingProps } from './types';

export const Subheading = ({
  text,
  expanded,
  setExpanded,
  getter,
}: SubheadingProps) => (
  <CanvasSubheading>
    <span>
      <FontAwesomeIcon
        icon={expanded ? faChevronDown : faChevronRight}
        transform="shrink-6"
      />
    </span>
    <button
      onClick={() => {
        setExpanded(!expanded);
        if (typeof getter === 'function') {
          getter();
        }
      }}
    >
      {text}
    </button>
  </CanvasSubheading>
);
