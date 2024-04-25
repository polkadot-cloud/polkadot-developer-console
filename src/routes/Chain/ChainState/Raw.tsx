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
import { Results } from './Results';

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
    chainState.subscribe(`${value}`, {
      type: 'raw',
      namespace: 'state',
      method: 'subscribeStorage',
      args: [[value]],
    });

    setChainUiItem(activeTabId, chainUiSection, 'selected', '');
  };

  // Test raw storage key for timestamp.now():
  // 0xf0c365c3cf59d671eb72da0e7a4113c49f1f0515f462cdcf84e0f1d6045dfcbb

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
          <ButtonSubmit
            onClick={() => handleSubmit()}
            disabled={!chainUi.selected}
          >
            Submit
            <FontAwesomeIcon icon={faCircleRight} transform="shrink-1" />
          </ButtonSubmit>
        </section>
      </InputFormWrapper>
      <Results />
    </>
  );
};
