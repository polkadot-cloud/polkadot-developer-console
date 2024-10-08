// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { ExtensionIcons } from '@w3ux/extension-assets/util';
import type { ExtensionProps } from './types';
import { ItemWrapper } from './Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExternalLinkAlt,
  faLink,
  faMinus,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { useExtensionAccounts, useExtensions } from '@w3ux/react-connect-kit';
import { localStorageOrDefault } from '@w3ux/utils';

export const Extension = ({ extension, last }: ExtensionProps) => {
  const { connectExtensionAccounts } = useExtensionAccounts();
  const { extensionsStatus, extensionCanConnect, extensionInstalled } =
    useExtensions();

  const { id, title, website } = extension;

  const isInstalled = extensionInstalled(id);
  const canConnect = extensionCanConnect(id);
  const connected = extensionsStatus[id] === 'connected';

  // Get the correct icon id for the extension.
  const iconId =
    window?.walletExtension?.isNovaWallet && id === 'polkadot-js'
      ? 'nova-wallet'
      : id;
  const Icon = ExtensionIcons[iconId];

  const websiteText = typeof website === 'string' ? website : website.text;
  const websiteUrl = typeof website === 'string' ? website : website.url;
  const disabled = !isInstalled;

  // Handle connect and disconnect from extension.
  const handleClick = async () => {
    if (!connected) {
      if (canConnect) {
        await connectExtensionAccounts(id);
      } else {
        alert('Console was unable to connect to the extension.');
      }
    } else {
      if (
        confirm(
          'Are you sure you want to disconnect from this extension? This will reload the console.'
        )
      ) {
        const updatedAtiveExtensions = (
          localStorageOrDefault('active_extensions', [], true) as string[]
        ).filter((ext: string) => ext !== id);

        localStorage.setItem(
          'active_extensions',
          JSON.stringify(updatedAtiveExtensions)
        );
        location.reload();
      }
    }
  };

  // Determine message to be displayed based on extension status.
  let statusJsx;
  switch (extensionsStatus[id]) {
    case 'connected':
      statusJsx = (
        <>
          <FontAwesomeIcon icon={faMinus} transform="shrink-4" />
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
    <ItemWrapper className={`${last ? ` last` : ``}`}>
      <div>
        <span className="icon-web">{Icon && <Icon />}</span>
      </div>
      <div>
        <div>
          <h4 className={`${connected ? ` connected` : ``}`}>
            {title}
            {connected && (
              <span className="badge">
                <FontAwesomeIcon icon={faLink} transform="grow-0" />
              </span>
            )}
          </h4>
          <h5>
            <a href={`https://${websiteUrl}`} target="_blank" rel="noreferrer">
              {websiteText}
              <FontAwesomeIcon icon={faExternalLinkAlt} transform="shrink-5" />
            </a>
          </h5>
        </div>
        <div>
          <button
            type="button"
            onClick={() => handleClick()}
            disabled={disabled}
          >
            {isInstalled ? statusJsx : 'Not Installed'}
          </button>
        </div>
      </div>
    </ItemWrapper>
  );
};
