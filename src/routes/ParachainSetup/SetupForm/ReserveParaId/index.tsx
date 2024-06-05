// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { AccountId32 } from 'library/Inputs/AccountId32';
import { useImportedAccounts } from 'contexts/ImportedAccounts';
import { FormWrapper } from 'routes/Home/Wrappers';
import { useParachain } from 'routes/ParachainSetup/Provider';
import { ParaIdOptionsWrapper } from '../Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { useEffect, useState } from 'react';
import { SubscriptionsController } from 'controllers/Subscriptions';
import { useParaSetup } from 'contexts/ParaSetup';
import { NextFreeParaId } from 'model/NextFreeParaId';
import { useActiveTab } from 'contexts/ActiveTab';
import BigNumber from 'bignumber.js';
import { faCircle } from '@fortawesome/sharp-regular-svg-icons';

export const ReserveParaId = () => {
  const { ownerId } = useActiveTab();
  const { getAccounts } = useImportedAccounts();
  const { chainSpec, chain, instanceId } = useParachain();
  const { getNextParaId, nextParaIdChainExists, addNextParaIdchain } =
    useParaSetup();

  const chainId = chain.id;
  const nextParaId = getNextParaId(chainId);

  // Store the selected option for the Para ID.
  const [selectedOption, setSelectedOption] = useState<'new' | 'existing'>(
    'new'
  );

  const accounts = chainSpec
    ? getAccounts(chainSpec.version.specName, chainSpec.ss58Prefix)
    : [];

  // Get the next free Para ID from the registrar.
  useEffect(() => {
    // Check if this next para id subscription is not already initialised.
    if (!nextParaIdChainExists(chainId)) {
      addNextParaIdchain(chainId);

      SubscriptionsController.set(
        instanceId,
        'nextFreeParaId',
        new NextFreeParaId(ownerId, instanceId, chainId)
      );
    }
  }, []);

  return (
    <FormWrapper>
      <h3>Reserve a Para ID or select an existing one from your accounts.</h3>

      <section>
        <AccountId32 accounts={accounts} />
        <ParaIdOptionsWrapper>
          <section>
            <div
              className={`inner ${selectedOption === 'new' ? ' selected' : ''}`}
            >
              <h3>Reserve New ID</h3>
              <h1>
                {nextParaId ? new BigNumber(nextParaId).toFormat() : '...'}
              </h1>
              <button className="foot" onClick={() => setSelectedOption('new')}>
                <span>
                  <h4>{selectedOption === 'new' ? ' Selected' : 'Select'}</h4>
                </span>
                <span>
                  <FontAwesomeIcon
                    icon={selectedOption === 'new' ? faCheckCircle : faCircle}
                    transform="grow-2"
                  />
                </span>
              </button>
            </div>
          </section>
          <section>
            <div
              className={`inner ${selectedOption === 'existing' ? ' selected' : ''}`}
            >
              <h3>Find Existing ID</h3>
              <h1>4,337</h1>
              <button
                className="foot"
                onClick={() => setSelectedOption('existing')}
              >
                <span>
                  <h4>
                    {selectedOption === 'existing' ? ' Selected' : 'Select'}
                  </h4>
                </span>
                <span>
                  <FontAwesomeIcon
                    icon={
                      selectedOption === 'existing' ? faCheckCircle : faCircle
                    }
                    transform="grow-2"
                  />
                </span>
              </button>
            </div>
          </section>
        </ParaIdOptionsWrapper>
      </section>
    </FormWrapper>
  );
};
