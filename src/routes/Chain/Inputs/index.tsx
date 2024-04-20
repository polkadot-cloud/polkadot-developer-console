// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FormatInputFields } from 'model/Metadata/Format/InputFields';
import { Textbox } from './Textbox';
import type { AnyJson } from '@w3ux/utils/types';
import type { ReactNode } from 'react';
import { Fragment } from 'react';
import { Select } from './Select';
import { Section } from './Section';
import type { InputArray } from './types';
import { Hash } from './Hash';
import { Sequence } from './Sequence';
import { Checkbox } from './Checkbox';
import { AccountId32 } from './AccountId32';

export const useInput = () => {
  // Reads input and returns input components based on the input type. Called recursively for types
  // that host other types.
  const readInput = (
    type: string,
    input: AnyJson,
    parentKey: string,
    indent = false
  ) => {
    switch (type) {
      case 'array':
        // If this array is a primitive, render a hash input. Otherwise (e.g. for variants) allow
        // for a sequence input.
        return input?.form?.primitive
          ? renderInput({ ...input, form: 'Hash' }, indent)
          : renderSequence(input, parentKey, input.len);

      case 'bitSequence':
        return renderInput(input, indent);

      case 'sequence':
        return renderSequence(input, parentKey);

      case 'tuple':
        return renderTuple(input, parentKey);

      case 'composite':
        return renderComposite(input, parentKey);

      case 'variant':
        return renderVariant(input, indent, parentKey);

      case 'primitive':
      default:
        return <>{renderInput(input, indent)}</>;
    }
  };

  // Renders an multi-input component.
  const renderSequence = (
    input: InputArray,
    parentKey: string,
    maxLength?: number
  ): ReactNode => {
    const [type, arrayInput]: [string, AnyJson] = Object.entries(input.form)[0];

    // Attach length to the array input.
    arrayInput.label = `[${arrayInput.label}, ${input.len}]`;

    return (
      <Sequence
        parentKey={parentKey}
        type={type}
        arrayInput={arrayInput}
        maxLength={maxLength}
      />
    );
  };

  // Renders a tuple input component.
  const renderTuple = (input: AnyJson, parentKey: string) =>
    input.map((item: AnyJson, index: number) => {
      const [tupleType, tupleInput] = Object.entries(item)[0];
      const key = `${parentKey}_${tupleType}_${index}`;

      return (
        <Fragment key={key}>
          {readInput(tupleType, tupleInput, key, true)}
        </Fragment>
      );
    });

  // Renders a composite input component.
  const renderComposite = (input: AnyJson, parentKey: string) =>
    renderLabelWithInner(
      input.label,
      input.form !== null
        ? renderInput(input, false)
        : Object.entries(input.forms).map(
            ([label, subInput]: AnyJson, index: number) => {
              const subType = Object.keys(subInput)[0];
              const key = `${parentKey}_${label}_${index}`;

              const subInputLabel = subInput[subType].label;

              // Prepend this type's label into child input label if they are different.
              const subInputWithLabel = {
                ...subInput[subType],
                label:
                  label !== subInputLabel
                    ? `${label}: ${subInput[subType].label}`
                    : label,
              };

              return (
                <Fragment key={key}>
                  {readInput(subType, subInputWithLabel, key, true)}
                </Fragment>
              );
            }
          )
    );

  // Renders a variant input component.
  const renderVariant = (
    input: AnyJson,
    indent: boolean,
    parentKey: string
  ) => {
    const selectedVariant = Object.keys(input.forms)[0];

    return (
      <>
        {renderInput(input, indent, Object.keys(input.forms))}
        {input.forms[selectedVariant].map(
          (subInput: AnyJson, index: number) => {
            const subType = Object.keys(subInput)[0];
            const key = `${parentKey}_${selectedVariant}_${subType}_${index}`;

            return (
              <Fragment key={key}>
                {readInput(subType, subInput[subType], key, true)}
              </Fragment>
            );
          }
        )}
      </>
    );
  };

  // Renders an inner input component.
  const renderInnerInput = (innerInput: ReactNode): ReactNode => (
    <Section>{innerInput}</Section>
  );

  // Renders a label with an inner input component.
  const renderLabelWithInner = (
    label: string | number,
    innerInput: ReactNode
  ) => (
    <Section indent={true}>
      <h4 className="marginTop">{label}</h4>
      {innerInput}
    </Section>
  );

  // Renders an input component wrapped in an input section.
  const renderInput = (
    {
      form,
      label,
    }: {
      form: AnyJson;
      label: string | number;
    },
    indent: boolean,
    values?: string[]
  ) =>
    (() => {
      switch (form) {
        // Input tailored for account addresses. Polkicon included. NOTE: `<Section>` is not needed
        // as the parent composite container is already wrapped.
        case 'AccountId32':
          return <AccountId32 />;

        // A custom input for primitive hash types.
        case 'Hash':
          return <Hash defaultValue={FormatInputFields.defaultValue(form)} />;

        // A dropdown select input for multiple option enums.
        case 'select':
          return (
            <Section indent={indent}>
              <Select label={label} values={values || []} />
            </Section>
          );

        // A switch to toggle boolean inputs.
        case 'checkbox':
          return (
            <Section indent={indent}>
              <Checkbox label={label} defaultValue={false} />
            </Section>
          );

        // Primitive textbox input. Also acts as the default input.
        case 'text':
        case 'number':
        default:
          return (
            <Section indent={indent}>
              <Textbox
                label={label}
                defaultValue={FormatInputFields.defaultValue(form)}
                numeric={form === 'number'}
              />
            </Section>
          );
      }
    })();

  return {
    readInput,
    renderInnerInput,
  };
};
