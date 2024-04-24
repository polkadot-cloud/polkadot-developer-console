// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useChainUi } from 'contexts/ChainUi';
import {
  InputFormWrapper,
  SelectFormWrapper,
  TextInputWrapper,
} from '../Wrappers';
import { ButtonSubmit } from 'library/Buttons/ButtonSubmit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleRight } from '@fortawesome/free-solid-svg-icons';
import { useActiveTabId } from 'contexts/ActiveTab';
import { ChainStateController } from 'controllers/ChainState';

export const Raw = () => {
  const activeTabId = useActiveTabId();
  const { getChainUi, setChainUiItem } = useChainUi();

  const chainUiSection = 'raw';
  const chainUi = getChainUi(activeTabId, chainUiSection);

  // Handle storage key change.
  const handleStorageKeyChange = (value: string) => {
    setChainUiItem(activeTabId, chainUiSection, 'selected', value);
  };

  // Handle storage key submission.
  const handleSubmit = () => {
    const value = chainUi.selected;
    if (!value || !value.length) {
      return;
    }

    const chainState = ChainStateController.instances[activeTabId];
    chainState.subscribe('raw', {
      namespace: 'state',
      method: 'subscribeStorage',
      args: [value],
    });
  };

  return (
    <>
      <SelectFormWrapper className="withHeader">
        <section className="singular">
          <div className="inner">
            <h5>Storage Key</h5>
            <TextInputWrapper>
              <input
                type="text"
                placeholder="0x..."
                value={chainUi.selected}
                onChange={(ev) => {
                  handleStorageKeyChange(ev.currentTarget.value);
                }}
              />
            </TextInputWrapper>
          </div>
        </section>
      </SelectFormWrapper>
      <InputFormWrapper>
        <section className="footer">
          <ButtonSubmit onClick={() => handleSubmit()}>
            Submit
            <FontAwesomeIcon icon={faCircleRight} transform="shrink-1" />
          </ButtonSubmit>
        </section>
      </InputFormWrapper>
    </>
  );
};
