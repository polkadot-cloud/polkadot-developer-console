// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { useRef } from 'react';
import { TabWrapper } from './Wrappers';
import { useTooltip } from 'contexts/Tooltip';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { MenuMouseEvent } from 'contexts/Menu/types';

interface ControlWithTooltipProps {
  icon: IconProp;
  tooltipText: string;
  onClick: (ev: MenuMouseEvent) => void;
  last?: boolean;
  inactive?: boolean;
}

export const ControlWithTooltip = ({
  icon,
  tooltipText,
  onClick,
  last = false,
  inactive = false,
}: ControlWithTooltipProps) => {
  const { openTooltip } = useTooltip();
  const ref = useRef(null);

  return (
    <TabWrapper
      ref={ref}
      onPointerOver={() => openTooltip(tooltipText, ref)}
      onClick={(ev) => onClick(ev)}
      className={`action${last ? ` last` : ``}${inactive ? ` inactive` : ``}`}
    >
      <FontAwesomeIcon icon={icon} />
    </TabWrapper>
  );
};
