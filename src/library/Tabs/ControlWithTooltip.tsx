// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useRef } from 'react';
import { TabWrapper } from './Wrappers';
import { useTooltip } from 'contexts/Tooltip';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ControlWithTooltipProps {
  icon: IconProp;
  tooltipText: string;
  onClick: () => void;
  last?: boolean;
}

export const ControlWithTooltip = ({
  icon,
  tooltipText,
  onClick,
  last = false,
}: ControlWithTooltipProps) => {
  const { openTooltip } = useTooltip();

  const ref = useRef(null);
  return (
    <TabWrapper
      ref={ref}
      onPointerOver={(ev) => openTooltip(ev, tooltipText, ref)}
      onClick={() => onClick()}
      className={`action${last ? ` last` : ``}`}
    >
      <FontAwesomeIcon icon={icon} />
    </TabWrapper>
  );
};
