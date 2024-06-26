// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FormWrapper } from 'routes/Home/Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/pro-solid-svg-icons';
import { useReserveParaId } from 'contexts/ParaSetup/ReserveParaId';
import { useActiveTab } from 'contexts/ActiveTab';
import { AccountId32 } from 'library/Inputs/AccountId32';
import { useImportedAccounts } from 'contexts/ImportedAccounts';
import { useParachain } from 'routes/ParachainSetup/Provider';
import { Label } from 'library/Inputs/Label';
import { Prompt } from '../Prompt';
import { Hash } from 'library/Inputs/Hash';

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
      <Prompt>
        <section>
          <h4>
            Configure your node using your acquired Para ID, and export your
            updated WebAssembly runtime and genesis state. Details on how to do
            this can be found in the Substrate.io article:
          </h4>
          <h4>
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
      </Prompt>

      <h3>Register your Parathread</h3>

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

      <section>
        <Label value="WebAssembly Runtime" />
        <Hash
          onChange={(val) => {
            console.debug(val);
            // TODO: implement
          }}
          value={''}
        />
      </section>

      <section>
        <Label value="Genesis State" />
        <Hash
          onChange={(val) => {
            console.debug(val);
            // TODO: implement
          }}
          value={''}
        />
      </section>
    </FormWrapper>
  );
};
