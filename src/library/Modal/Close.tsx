// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useOverlay } from 'library/Overlay/Provider';
import { CloseWrapper } from './Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCross } from '@fortawesome/pro-duotone-svg-icons';

export const Close = () => {
  const { setModalStatus } = useOverlay().modal;

  return (
    <CloseWrapper>
      <button type="button" onClick={() => setModalStatus('closing')}>
        <FontAwesomeIcon icon={faCross} />
      </button>
    </CloseWrapper>
  );
};
