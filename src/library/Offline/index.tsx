// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Wrapper } from './Wrapper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWarning } from '@fortawesome/free-solid-svg-icons';
import { useRef, useState } from 'react';
import { useEventListener } from 'usehooks-ts';
import { isCustomEvent } from 'Utils';

export const Offline = () => {
  // Whether the app is offline.
  const [offline, setOffline] = useState<boolean>(false);

  // Handle incoming online status updates.
  const handleOnlineStatus = (e: Event): void => {
    if (isCustomEvent(e)) {
      const { online } = e.detail;
      setOffline(!online);
    }
  };

  // Listen for online status updates.
  const documentRef = useRef<Document>(document);
  useEventListener('online-status', handleOnlineStatus, documentRef);

  if (!offline) {
    return null;
  }
  return (
    <Wrapper>
      <FontAwesomeIcon icon={faWarning} />
      <h3>Connection appears to be offline</h3>
    </Wrapper>
  );
};
