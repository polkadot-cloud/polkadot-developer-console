// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTerminal } from '@fortawesome/free-solid-svg-icons';
import { useMenu } from 'contexts/Menu';
import { HelpWrapper } from 'library/ContextMenu/Wrappers';

export const InDevelopment = () => {
  const { dismissMenu } = useMenu();

  return (
    <HelpWrapper>
      <h4>
        <FontAwesomeIcon icon={faTerminal} transform="shrink-1" /> In
        Development
      </h4>
      <p>
        This feature is currently being developed. Please check back at a later
        date.
      </p>
      <button type="button" onClick={() => dismissMenu()}>
        Got it
      </button>
    </HelpWrapper>
  );
};
