// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FormatInputFields } from 'model/Metadata/Format/InputFields';
import { Textbox } from './Textbox';
import type { AnyJson } from '@w3ux/utils/types';
import type { ReactNode } from 'react';
import { Fragment } from 'react';
import { Select } from './Select';
import { Section } from './Section';
import type { InputArgConfig, InputArray, InputItem } from './types';
import { Hash } from './Hash';
import { Sequence } from './Sequence';
import { Checkbox } from './Checkbox';
import { AccountId32 } from './AccountId32';

export const useInput = () => {
  // Reads input and returns input components based on the input type. Called recursively for types
  // that host other types.
  const readInput = (
    type: string,
    inputArgConfig: InputArgConfig,
    input: AnyJson,
    indent = false
  ) => {
    switch (type) {
      case 'array':
        // If this array is a primitive, render a textbox input. Otherwise (e.g. for variants) allow
        // for a sequence input.
        return input?.form?.primitive
          ? renderInput(
              { ...input.form.primitive, form: 'text' },
              inputArgConfig,
              indent
            )
          : renderSequence(input, inputArgConfig, input.len);

      case 'bitSequence':
        return renderInput(input, inputArgConfig, indent);

      case 'sequence':
        return renderSequence(input, inputArgConfig);

      case 'tuple':
        return renderTuple(input, inputArgConfig);

      case 'composite':
        return renderComposite(input, inputArgConfig);

      case 'variant':
        return renderVariant(input, inputArgConfig, indent);

      case 'primitive':
      default:
        return <>{renderInput(input, inputArgConfig, indent)}</>;
    }
  };

  // Renders an multi-input component.
  const renderSequence = (
    input: InputArray,
    inputArgConfig: InputArgConfig,
    maxLength?: number
  ): ReactNode => {
    const [type, arrayInput]: [string, AnyJson] = Object.entries(
      input.form
    )?.[0] || ['unknown', {}];

    // Attach length to the array input.
    arrayInput.label = `[${arrayInput.label}, ${input.len}]`;
    return renderLabelWithInner(
      `${input.label}[]`,
      <Sequence
        {...inputArgConfig}
        type={type}
        arrayInput={arrayInput}
        maxLength={maxLength}
      />
    );
  };

  // Renders a tuple input component.
  const renderTuple = (
    input: AnyJson,
    { inputArgsFor, inputKey }: InputArgConfig
  ) => {
    console.log(inputKey, '(tuple)');

    return input.map((item: AnyJson, index: number) => {
      const [tupleType, tupleInput] = Object.entries(item)[0];
      const childInputKey = `${inputKey}_${index}`;

      return (
        <Fragment key={`input_arg_${childInputKey}`}>
          {readInput(
            tupleType,
            { inputArgsFor, inputKey: childInputKey },
            tupleInput,
            true
          )}
        </Fragment>
      );
    });
  };

  // Renders a composite input component.
  const renderComposite = (input: AnyJson, inputArgConfig: InputArgConfig) => {
    let inner: ReactNode = null;
    const { inputArgsFor, inputKey } = inputArgConfig;

    if (input.form !== null) {
      inner = renderInput(input, inputArgConfig, false);
    } else {
      console.log(inputKey, '(composite)');
      inner = Object.entries(input.forms).map(
        ([label, subInput]: AnyJson, index: number) => {
          const subType = Object.keys(subInput)[0];
          const childInputKey = `${inputKey}_${index}`;

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
            <Fragment key={`input_arg_${childInputKey}`}>
              {readInput(
                subType,
                { inputArgsFor, inputKey: childInputKey },
                subInputWithLabel,
                true
              )}
            </Fragment>
          );
        }
      );
    }
    return renderLabelWithInner(input.label, inner);
  };

  // Renders a variant input component.
  const renderVariant = (
    input: AnyJson,
    inputArgConfig: InputArgConfig,
    indent: boolean
  ) => {
    const selectedVariant = Object.keys(input.forms)[0];
    const { inputArgsFor, inputKey } = inputArgConfig;
    return (
      <>
        {renderInput(input, inputArgConfig, indent, Object.keys(input.forms))}
        {input.forms[selectedVariant].map(
          (subInput: AnyJson, index: number) => {
            const subType = Object.keys(subInput)[0];
            const childInputKey = `${inputKey}_${index}`;

            return (
              <Fragment key={`input_arg_${childInputKey}`}>
                {readInput(
                  subType,
                  { inputArgsFor, inputKey: childInputKey },
                  subInput[subType],
                  true
                )}
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
    { form, label }: InputItem,
    inputArgConfig: InputArgConfig,
    indent: boolean,
    values?: string[]
  ) =>
    (() => {
      switch (form) {
        // Input tailored for account addresses. Polkicon included. NOTE: `<Section>` is not needed
        // as the parent composite container is already wrapped.
        case 'AccountId32':
          return <AccountId32 {...inputArgConfig} />;

        // A custom input for primitive hash types.
        case 'Hash':
          return (
            <Hash
              {...inputArgConfig}
              defaultValue={FormatInputFields.defaultValue(form)}
            />
          );

        // A dropdown select input for multiple option enums.
        case 'select':
          return (
            <Section indent={indent}>
              <Select {...inputArgConfig} label={label} values={values || []} />
            </Section>
          );

        // A switch to toggle boolean inputs.
        case 'checkbox':
          return (
            <Section indent={indent}>
              <Checkbox
                {...inputArgConfig}
                label={label}
                defaultValue={false}
              />
            </Section>
          );

        // Primitive textbox input. Also acts as the default input.
        case 'text':
        case 'number':
        default:
          return (
            <Section indent={indent}>
              <Textbox
                {...inputArgConfig}
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
