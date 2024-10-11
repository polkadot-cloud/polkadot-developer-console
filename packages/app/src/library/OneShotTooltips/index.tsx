// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { useOneShotTooltip } from 'contexts/OneShotTooltip';
import { Tooltip } from './Tooltip';

export const OneShotTooltips = () => {
  const { tooltips } = useOneShotTooltip();

  return (
    <>
      {Object.entries(tooltips).map(([id, tooltip]) => (
        <Tooltip
          key={`one_shot_tooltip_${id}`}
          id={Number(id)}
          tooltip={tooltip}
        />
      ))}
    </>
  );
};
