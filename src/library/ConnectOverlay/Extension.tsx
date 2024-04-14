// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ExtensionIcons } from '@w3ux/extension-assets/util';
import type { ExtensionProps } from './types';
import { ItemWrapper } from './Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExternalLinkAlt,
  faMinus,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { useExtensions } from '@w3ux/react-connect-kit';

export const Extension = ({ extension, last }: ExtensionProps) => {
  const { extensionsStatus, extensionInstalled } = useExtensions();

  const { id, title, website } = extension;

  const isInstalled = extensionInstalled(id);
  // const canConnect = extensionCanConnect(id);

  // Get the correct icon id for the extension.
  const iconId =
    window?.walletExtension?.isNovaWallet && id === 'polkadot-js'
      ? 'nova-wallet'
      : id;
  const Icon = ExtensionIcons[iconId];

  const websiteText = typeof website === 'string' ? website : website.text;
  const websiteUrl = typeof website === 'string' ? website : website.url;
  const disabled = !isInstalled;

  // Determine message to be displayed based on extension status.
  let statusJsx;
  switch (extensionsStatus[id]) {
    case 'connected':
      statusJsx = (
        <>
          <FontAwesomeIcon icon={faMinus} transform="shrink-2" />
          Disconnect
        </>
      );
      break;

    case 'not_authenticated':
      statusJsx = 'Not Authenticated';
      break;

    default:
      statusJsx = (
        <>
          <FontAwesomeIcon icon={faPlus} transform="shrink-2" />
          Connect
        </>
      );
  }

  return (
    <ItemWrapper className={last ? 'last' : undefined}>
      <div>
        <span className="icon-web">{Icon && <Icon />}</span>
      </div>
      <div>
        <div>
          <h4>{title}</h4>
          <h5>
            <a href={`https://${websiteUrl}`} target="_blank" rel="noreferrer">
              {websiteText}
              <FontAwesomeIcon icon={faExternalLinkAlt} transform="shrink-5" />
            </a>
          </h5>
        </div>
        <div>
          <button
            onClick={() => {
              /* Do nothing. */
            }}
            disabled={disabled}
          >
            {isInstalled ? statusJsx : 'Not Installed'}
          </button>
        </div>
      </div>
    </ItemWrapper>
  );
};
