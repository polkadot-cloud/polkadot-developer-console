// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { ButtonSubmitLargeProps } from './types';
import { CloudIcon } from '@polkadot-cloud/icons';
import { appendOrEmpty } from '@w3ux/utils';
import { CallToActionWrapper } from 'library/CallToAction';

export const ButtonSubmitLarge = ({
  disabled,
  onSubmit,
  submitText,
  icon,
  iconTransform,
  pulse,
}: ButtonSubmitLargeProps) => (
  <CallToActionWrapper>
    <div className="inner">
      <section className="standalone">
        <div className="buttons">
          <div
            className={`button primary standalone${appendOrEmpty(disabled, 'disabled')}${appendOrEmpty(pulse, 'pulse')}`}
          >
            <button
              type="button"
              onClick={() => onSubmit()}
              disabled={disabled}
            >
              {icon && (
                <CloudIcon icon={icon} transform={iconTransform || undefined} />
              )}
              {submitText}
            </button>
          </div>
        </div>
      </section>
    </div>
  </CallToActionWrapper>
);
