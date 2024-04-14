// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCheck, faCopy, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { ellipsisFn, unescape } from '@w3ux/utils';
import { Wrapper } from './Wrapper';
import type { HardwareAddressProps } from './types';

export const HardwareAddress = ({
  address,
  index,
  initial,
  disableEditIfImported = false,
  Identicon,
  existsHandler,
  renameHandler,
  openConfirmHandler,
  openRemoveHandler,
}: HardwareAddressProps) => {
  // Store whether this address is being edited.
  const [editing, setEditing] = useState<boolean>(false);

  // Store the currently saved name.
  const [name, setName] = useState<string>(initial);

  // Store the currently edited name.
  const [editName, setEditName] = useState<string>(initial);

  // Cancel editing and revert to the original name.
  const cancelEditing = () => {
    setEditName(name);
    setEditing(false);
  };

  // Commit the edited name.
  const commitEdit = () => {
    let newName = editName;
    if (editName === '') {
      newName = ellipsisFn(address, 6);
    }
    if (newName !== name) {
      setName(newName);
      setEditName(newName);
      renameHandler(address, newName);
    }
    setEditing(false);
  };

  // Handle an input change.
  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    let val = e.currentTarget.value || '';
    val = unescape(val);
    setEditName(val);
  };

  // Check whether this address is imported.
  const isImported = existsHandler(address);

  return (
    <Wrapper>
      <div className="border"></div>
      <div className="content">
        <div className="inner">
          <div className="identicon">
            {Identicon}
            <div className="counter">{index + 1}</div>
          </div>
          <div>
            <section className="row">
              <input
                disabled={isImported && disableEditIfImported}
                type="text"
                value={editing ? editName : name}
                onChange={(e) => handleChange(e)}
                onFocus={() => setEditing(true)}
                onBlur={() => commitEdit()}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    commitEdit();
                    e.currentTarget.blur();
                  }
                }}
              />

              {editing && (
                <div style={{ display: 'flex' }}>
                  &nbsp;
                  <button
                    type="button"
                    className="edit"
                    onClick={() => commitEdit()}
                  >
                    <FontAwesomeIcon
                      icon={faCheck}
                      transform="shrink-2"
                      className="icon"
                    />
                  </button>
                  &nbsp;
                  <button
                    type="button"
                    className="edit"
                    onClick={() => cancelEditing()}
                  >
                    <FontAwesomeIcon icon={faXmark} transform="shrink-2" />
                  </button>
                </div>
              )}
            </section>
            <h5 className="full">
              <span>
                {ellipsisFn(address, 10)}{' '}
                <button onClick={() => navigator.clipboard.writeText(address)}>
                  <FontAwesomeIcon icon={faCopy} transform="shrink-5" />
                </button>
              </span>
            </h5>
          </div>
        </div>
      </div>
      <div className="action">
        {isImported ? (
          <button onClick={() => openRemoveHandler(address)}>Remove</button>
        ) : (
          <button onClick={() => openConfirmHandler(address, index)}>
            Import
          </button>
        )}
      </div>
    </Wrapper>
  );
};