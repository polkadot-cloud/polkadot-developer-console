// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { FormWrapper } from 'routes/Home/Wrappers';
import { Prompt } from '../Prompt';
import { ParaIdOptionsWrapper } from '../ReserveParaId/Wrappers';
import { CloudIcon } from '@polkadot-cloud/icons';
import { iconExternalLink } from '@polkadot-cloud/icons/regular';

export const GetCoretime = () => (
  <FormWrapper>
    <Prompt>
      <section>
        <h4>
          Developer Console does not yet support purchasing of Coretime. Please
          use the following platforms to continue to purchase Coretime.
        </h4>
      </section>
    </Prompt>

    <section>
      <h3>Coretime Marketplace Platforms:</h3>

      <ParaIdOptionsWrapper>
        <section>
          <div className={`inner`}>
            <button onClick={() => window.open('https://www.lastic.xyz/')}>
              <h1 className="standalone">Lastic</h1>
            </button>

            <button
              className="foot"
              onClick={() => window.open('https://www.lastic.xyz/')}
            >
              <span>
                <h4>
                  https://www.lastic.xyz{' '}
                  <CloudIcon icon={iconExternalLink} transform="shrink-2" />
                </h4>
              </span>
              <span></span>
            </button>
          </div>
        </section>

        <section>
          <div className={`inner`}>
            <button onClick={() => window.open('https://app.regionx.tech/')}>
              <h1 className="standalone">RegionX</h1>
            </button>

            <button
              className="foot"
              onClick={() => window.open('https://app.regionx.tech/')}
            >
              <span>
                <h4>
                  https://app.regionx.tech{' '}
                  <CloudIcon icon={iconExternalLink} transform="shrink-2" />
                </h4>
              </span>
              <span></span>
            </button>
          </div>
        </section>
      </ParaIdOptionsWrapper>
    </section>
  </FormWrapper>
);
