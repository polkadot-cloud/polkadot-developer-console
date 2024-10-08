// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { Suspense, lazy, useMemo } from 'react';
import { useMenu } from 'contexts/Menu';
import type { DirectoryId } from 'config/networks/types';
import { ButtonText } from 'library/Buttons/ButtonText';
import { ConnectContextMenu } from 'library/ConnectContextMenu';
import {
  iconArrowRightFromLine,
  iconHashtag,
} from '@polkadot-cloud/icons/duotone';
import { ChainItemWrapper } from '../Connect/Wrappers';
import { getIconFilename } from 'config/networks/Utils';
import { CloudIcon } from '@polkadot-cloud/icons';

export interface ChainItemProps {
  chainId: DirectoryId;
  name: string;
  onSelect: (chainId: DirectoryId, endpoint: string) => Promise<void>;
}

export const ChainItem = ({ chainId, name, onSelect }: ChainItemProps) => {
  const { openMenu, closeMenu } = useMenu();

  // Lazily load the icon for the chain.
  const Icon = useMemo(
    () =>
      lazy(
        () =>
          import(
            `../../../config/networks/icons/${getIconFilename(chainId)}/Inline.tsx`
          )
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
          <ButtonText
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
            <CloudIcon
              icon={iconArrowRightFromLine}
              transform="grow-0"
              className="iconRight"
            />
          </ButtonText>
        </section>
      </div>

      <div className="body">
        <h5>
          <CloudIcon icon={iconHashtag} transform="shrink-2" />
          {chainId}
        </h5>
      </div>
      <div className="footer empty"></div>
    </ChainItemWrapper>
  );
};
