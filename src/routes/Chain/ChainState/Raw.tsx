// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useChainUi } from 'contexts/ChainUi';
import { useTabs } from 'contexts/Tabs';
import { SelectFormWrapper, TextInputWrapper } from '../Wrappers';
import { ButtonSubmit } from 'library/Buttons/ButtonSubmit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleRight } from '@fortawesome/free-solid-svg-icons';

export const Raw = () => {
  const { activeTabId } = useTabs();
  const { getChainUi, setChainUiItem } = useChainUi();

  const chainUiSection = 'raw';
  const chainUi = getChainUi(activeTabId, chainUiSection);

  // Handle storage key change.
  const handleStorageKeyChange = (value: string) => {
    setChainUiItem(activeTabId, chainUiSection, 'selected', value);
  };

  return (
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

      <section className="singular footer">
        <ButtonSubmit
          onClick={() => {
            /* Do nothing */
          }}
        >
          Submit
          <FontAwesomeIcon icon={faCircleRight} transform="shrink-1" />
        </ButtonSubmit>
      </section>
    </SelectFormWrapper>
  );
};