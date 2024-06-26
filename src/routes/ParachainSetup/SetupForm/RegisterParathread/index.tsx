// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FormWrapper } from 'routes/Home/Wrappers';
import { SetupPrompt } from '../Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/pro-regular-svg-icons';
import { faExternalLinkAlt } from '@fortawesome/pro-solid-svg-icons';
import { useReserveParaId } from 'contexts/ParaSetup/ReserveParaId';
import { useActiveTab } from 'contexts/ActiveTab';
import { AccountId32 } from 'library/Inputs/AccountId32';
import { useImportedAccounts } from 'contexts/ImportedAccounts';
import { useParachain } from 'routes/ParachainSetup/Provider';
import { Label } from 'library/Inputs/Label';

export const RegisterParathread = () => {
  const { chainSpec } = useParachain();
  const { tabId, metaKey } = useActiveTab();
  const { getAccounts } = useImportedAccounts();
  const { getSelectedAccount, validateParaId } = useReserveParaId();

  const accounts = chainSpec
    ? getAccounts(chainSpec.version.specName, chainSpec.ss58Prefix)
    : [];

  // Get the selected account for the Para ID.
  const selectedAccount = getSelectedAccount(tabId) || '';

  // Get whether a valid para id has been entered.
  const isValidParaId = validateParaId(tabId, selectedAccount);

  // Get the selected account if a valid para id has been entered, otherwise return an empty array.
  const registrantInputValues = !isValidParaId
    ? []
    : accounts.filter((account) => account.address === selectedAccount);

  return (
    <FormWrapper>
      <h3>Register your Parathread</h3>

      <SetupPrompt>
        <section>
          <FontAwesomeIcon icon={faCircleInfo} className="info-svg" />
        </section>
        <section>
          <h4>
            You can now configure your node using your acquired Para ID, and
            export your WebAssembly runtime and genesis state. Details on how to
            do this can be found in the Substrate.io article{' '}
            <a
              href="https://docs.substrate.io/tutorials/build-a-parachain/acquire-a-testnet-slot/#export-required-files"
              rel="noreferrer"
              target="_blank"
            >
              Acquire a testnet slot{' '}
              <FontAwesomeIcon icon={faExternalLinkAlt} transform="shrink-3" />
            </a>
            .
          </h4>
        </section>
      </SetupPrompt>

      <section>
        <Label value="Registrant" />
        <AccountId32
          inputId={`${metaKey}_registerParathreadRegistrant`}
          defaultAddress={isValidParaId ? selectedAccount : ''}
          accounts={registrantInputValues}
          readOnly={true}
          disabled={true}
          disabledText="Para ID Registrant Not Set"
        />
      </section>
    </FormWrapper>
  );
};
