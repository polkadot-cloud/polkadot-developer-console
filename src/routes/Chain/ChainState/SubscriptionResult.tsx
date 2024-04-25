/* Copyright 2024 @rossbulat/console authors & contributors
SPDX-License-Identifier: GPL-3.0-only */

import {
  faClone,
  faThumbtack,
  faXmark,
} from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { capitalizeFirstLetter } from '@w3ux/utils';

export const SubscriptionResult = () => {
  const type = 'raw';
  const key =
    '0xf0c365c3cf59d671eb72da0e7a4113c49f1f0515f462cdcf84e0f1d6045dfcbb';
  const result = '0x6141ca128f010000';

  return (
    <section>
      <div className="inner">
        <div className="header">
          <h5>
            {capitalizeFirstLetter(type)}: {key}
          </h5>
        </div>
        <div className="value">
          <div>
            <h4>{result}</h4>
          </div>
          <div>
            <button
              onClick={() =>
                navigator.clipboard.writeText('0x6141ca128f010000')
              }
            >
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
