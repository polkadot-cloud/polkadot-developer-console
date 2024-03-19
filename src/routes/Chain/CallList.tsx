// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useOutsideAlerter } from 'hooks/useOutsideAlerter';
import { useRef, useState } from 'react';
import {
  SelectItemWrapper,
  SelectTextWrapper,
  SelectDropdownWrapper,
} from './Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import type { AnyJson } from '@w3ux/utils/types';
import { Format } from 'model/Metadata/Scraper/Format';

export const CallList = ({ calls }: { calls: AnyJson }) => {
  // Call selection open.
  const [callsOpen, setCallsOpenState] = useState<boolean>(false);

  // Setter for call menu open state.
  const setCallsOpen = (value: boolean) => {
    setCallsOpenState(value);
  };

  // Refs for the selection menus.
  const callsSelectRef = useRef(null);

  // Close call selection if clicked outside of its container.
  useOutsideAlerter(
    callsSelectRef,
    () => {
      setCallsOpen(false);
    },
    ['ignore-outside-alerter-calls']
  );

  // Format calls into a new `selection` array for rendering.
  let selection: {
    name: string;
    docs: string[];
    fieldNames: string | undefined;
    fieldTypes: string | undefined;
  }[] = [];

  // Calls type should aways be a variant, but checking to prevent errors.
  if (calls && calls.type === 'variant') {
    calls.variant.forEach(
      ({
        name,
        docs,
        fields,
      }: {
        name: string;
        docs: string[];
        fields: AnyJson[];
      }) => {
        // Get string representations of field names only.
        const fieldNames = Format.fieldNames(fields);

        // Get string representations of field names and their types.
        const fieldTypes = Format.fieldTypes(fields);

        // Push the call, docs and formatted field values to `selection`.
        selection.push({ name, docs, fieldNames, fieldTypes });
      }
    );
  }

  // Sort calls alphabetically based on call name.
  selection = selection.sort(({ name: nameA }, { name: nameB }) =>
    nameA < nameB ? -1 : nameA > nameB ? 1 : 0
  );

  return (
    <section>
      <div className="inner">
        <h5>Call</h5>
        <SelectItemWrapper
          className={`standalone${callsOpen ? ` open` : ``} ignore-outside-alerter-calls`}
          onClick={() => {
            setCallsOpen(!callsOpen);
          }}
        >
          <span>
            <SelectTextWrapper>
              {selection[0]?.name || 'No Calls'}
              {selection[0]?.fieldNames && (
                <span>({selection[0].fieldNames})</span>
              )}
            </SelectTextWrapper>
          </span>
          <span>
            <h5>{selection[0]?.docs?.[0] || ''}</h5>
            <FontAwesomeIcon icon={faChevronDown} transform="shrink-4" />
          </span>
        </SelectItemWrapper>

        <SelectDropdownWrapper
          ref={callsSelectRef}
          className={`${callsOpen ? ` open` : ``}`}
        >
          {selection.map(({ name, docs, fieldNames }) => (
            <SelectItemWrapper
              key={`call_select_${name}`}
              className="option"
              onClick={() => setCallsOpen(false)}
            >
              <span>
                <SelectTextWrapper>
                  {name}
                  {fieldNames && <span>({fieldNames})</span>}
                </SelectTextWrapper>
              </span>
              <span>
                <h5>{docs[0]}</h5>
              </span>
            </SelectItemWrapper>
          ))}
        </SelectDropdownWrapper>
      </div>
    </section>
  );
};
