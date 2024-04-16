// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ellipsisFn, remToUnit } from '@w3ux/utils';
import type { AccountProps } from './types';
import { Polkicon } from '@w3ux/react-polkicon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

export const Account = ({ account }: AccountProps) => {
  const { name, address } = account;

  return (
    <section>
      <div className="inner">
        <div className="icon">
          <Polkicon address={address} size={remToUnit('1.7rem')} />
        </div>
        <div className="content">
          <div className="name">
            <h3>{name}</h3>
          </div>
          <div className="address">
            <h5>
              {ellipsisFn(address, 7)}
              <button
                className="copy"
                onClick={() => navigator.clipboard.writeText(address)}
              >
                <FontAwesomeIcon icon={faCopy} transform="shrink-4" />
              </button>
            </h5>
          </div>
        </div>
      </div>
    </section>
  );
};
