// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Suspense, lazy, useMemo } from 'react';
import { useMenu } from 'contexts/Menu';
import type { ChainId, DirectoryId } from 'config/networks/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonSubmit } from 'library/Buttons/ButtonSubmit';
import { ConnectContextMenu } from 'library/ConnectContextMenu';
import {
  faArrowRightFromLine,
  faHashtag,
} from '@fortawesome/pro-duotone-svg-icons';
import { ChainItemWrapper } from '../Connect/Wrappers';

export interface ChainItemProps {
  chainId: DirectoryId;
  name: string;
  onSelect: (chainId: ChainId, endpoint: string) => Promise<void>;
}

export const ChainItem = ({ chainId, name, onSelect }: ChainItemProps) => {
  const { openMenu, closeMenu } = useMenu();

  // Lazily load the icon for the chain.
  const Icon = useMemo(
    () =>
      lazy(
        () => import(`../../../config/networks/icons/${chainId}/Inline.tsx`)
      ),
    []
  );

  // Handle tag provider select. Connect to chain on successful selection.
  const handleOnProviderSelect = (endpoint: string) => {
    // Call provided `onSelect` function.
    onSelect(chainId, endpoint);

    // Close menu.
    closeMenu();
  };

  return (
    <ChainItemWrapper>
      <div className="header">
        <section>
          <Suspense fallback={<div />}>
            <div className="icon">
              <Icon />
            </div>
          </Suspense>
          <h3>{name}</h3>
        </section>
        <section>
          <ButtonSubmit
            onClick={(ev) => {
              openMenu(
                ev,
                <ConnectContextMenu
                  chainId={chainId}
                  onSelect={handleOnProviderSelect}
                />
              );
            }}
          >
            Connect
            <FontAwesomeIcon
              icon={faArrowRightFromLine}
              transform="grow-0"
              className="iconRight"
            />
          </ButtonSubmit>
        </section>
      </div>

      <div className="body">
        <h5>
          <FontAwesomeIcon icon={faHashtag} transform="shrink-2" />
          {chainId}
        </h5>
      </div>
      <div className="footer empty"></div>
    </ChainItemWrapper>
  );
};
