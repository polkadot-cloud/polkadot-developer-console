// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  faClone,
  faThumbtack,
  faXmark,
} from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { capitalizeFirstLetter } from '@w3ux/utils';
import type { SubscriptionResultProps } from '../types';

export const SubscriptionResult = ({
  subscriptionKey,
  type,
  result,
}: SubscriptionResultProps) => {
  const display = result?.toHuman();

  // Should not happen, but just in case result is undefined or `toHuman()` fails on a result, don't
  // display it.
  if (display === undefined) {
    return null;
  }

  return (
    <section>
      <div className="inner">
        <div className="header">
          <h5>
            {capitalizeFirstLetter(type)}: {subscriptionKey}
          </h5>
        </div>
        <div className="value">
          <div>
            <h4>{display}</h4>
          </div>
          <div>
            <button onClick={() => navigator.clipboard.writeText(display)}>
              <FontAwesomeIcon icon={faClone} transform="shrink-2" />
            </button>
          </div>
        </div>
      </div>
      <div className="dismiss">
        <button
          className="close"
          onClick={() => {
            /* TODO: implement */
          }}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <button
          onClick={() => {
            /* TODO: implement */
          }}
        >
          <FontAwesomeIcon icon={faThumbtack} transform="shrink-2" />
        </button>
      </div>
    </section>
  );
};
