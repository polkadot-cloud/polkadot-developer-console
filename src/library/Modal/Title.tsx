// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useOverlay } from 'library/Overlay/Provider';
import { TitleWrapper } from './Wrappers';
import type { TitleProps } from './types';
import { faTimes } from '@fortawesome/pro-duotone-svg-icons';

export const Title = ({ title, icon, fixed, Svg, style }: TitleProps) => {
  const { setModalStatus } = useOverlay().modal;

  const graphic = Svg ? (
    <Svg style={{ width: '1.5rem', height: '1.5rem' }} />
  ) : icon ? (
    <FontAwesomeIcon transform="grow-3" icon={icon} />
  ) : null;

  return (
    <TitleWrapper $fixed={fixed || false} style={{ ...style }}>
      <div>
        {graphic}
        <h2>{title}</h2>
      </div>
      <div>
        <button type="button" onClick={() => setModalStatus('closing')}>
          <FontAwesomeIcon icon={faTimes} transform="grow-2" />
        </button>
      </div>
    </TitleWrapper>
  );
};
