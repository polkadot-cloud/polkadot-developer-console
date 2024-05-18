// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faClone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useOneShotTooltip } from 'contexts/OneShotTooltip';
import { useRef } from 'react';

export const ButtonCopy = ({
  copyText,
  tooltipText,
  id,
  transform,
}: {
  copyText: string;
  tooltipText: string;
  transform?: string;
  id: string;
}) => {
  const { openTooltip } = useOneShotTooltip();
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={ref}
      id={id}
      onClick={() => {
        navigator.clipboard.writeText(copyText);
        openTooltip(tooltipText, ref);
      }}
    >
      <FontAwesomeIcon icon={faClone} transform={transform} />
    </button>
  );
};
