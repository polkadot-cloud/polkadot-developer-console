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
import { Formatter } from 'controllers/MetadataScraper/Formatter';

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
    ['ignore-outside-alerter']
  );

  // Format calls into a new `selection` array for rendering.
  const selection: {
    call: string;
    docs: string[];
    fieldNames: string | undefined;
    fieldTypes: string | undefined;
  }[] = [];

  // Calls type should aways be a variant, but checking to prevent errors.
  if (calls && calls.type === 'variant') {
    const variant = Object.entries(calls.variant) as [string, AnyJson][];

    variant.forEach(
      ([call, { docs, fields }]: [
        string,
        { docs: string[]; fields: Record<string, string> },
      ]) => {
        // Get string representations of field names only.
        const fieldNames = Formatter.formatFieldNames(fields);

        // Get string representations of field names and their types.
        const fieldTypes = Formatter.formatFieldTypes(fields);

        // Push the call, docs and formatted field values to `selection`.
        selection.push({ call, docs, fieldNames, fieldTypes });
      }
    );
  }

  return (
    <section>
      <h5>Call</h5>
      <SelectItemWrapper
        className={`standalone${callsOpen ? ` open` : ``} ignore-outside-alerter`}
        onClick={() => {
          setCallsOpen(!callsOpen);
        }}
      >
        <span>
          <SelectTextWrapper>
            {selection[0]?.call || 'No Calls'}
            {selection[0]?.fieldNames && (
              <span>({selection[0].fieldNames})</span>
            )}
          </SelectTextWrapper>
        </span>
        <span>
          <FontAwesomeIcon icon={faChevronDown} transform="shrink-4" />
        </span>
      </SelectItemWrapper>

      <SelectDropdownWrapper
        ref={callsSelectRef}
        className={`${callsOpen ? ` open` : ``}`}
      >
        {selection.map(({ call, docs, fieldNames }) => (
          <SelectItemWrapper
            key={`call_select_${call}`}
            className="option"
            onClick={() => setCallsOpen(false)}
          >
            <span>
              <SelectTextWrapper>
                {call}
                {fieldNames && <span>({fieldNames})</span>}
              </SelectTextWrapper>
            </span>
            <span>
              <h5>{docs[0]}</h5>
            </span>
          </SelectItemWrapper>
        ))}
      </SelectDropdownWrapper>
    </section>
  );
};
