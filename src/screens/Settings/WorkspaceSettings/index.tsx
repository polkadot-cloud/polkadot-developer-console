// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SettingsHeaderWrapper } from 'library/Settings/Wrappers';
import {
  SettingsSubmitWrapper,
  SettingsToggleWrapper,
} from '../TabSettings/Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDownload,
  faFileImport,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';

export const WorkspaceSettings = () => (
  <>
    <SettingsHeaderWrapper>
      <h2>Workspace Settings</h2>
    </SettingsHeaderWrapper>

    <SettingsToggleWrapper>
      <div className="text">
        <h4>Export Workspace</h4>
        <h3>
          Back up your current workspace state. Exports your tabs, tags, chain
          search settings.
        </h3>
      </div>
    </SettingsToggleWrapper>

    <SettingsSubmitWrapper>
      <div className="buttons">
        <button
          onClick={() => {
            /* Do nothing */
          }}
        >
          <FontAwesomeIcon icon={faDownload} />
          Export Workspace
        </button>
      </div>
    </SettingsSubmitWrapper>

    <SettingsToggleWrapper>
      <div className="text">
        <h4>Import Workspace</h4>
        <h3>Import a workspace configuration.</h3>
        <h3 className="inline danger">
          <FontAwesomeIcon icon={faTriangleExclamation} />
          &nbsp; Importing a workspace will replace your current workspace - all
          current state, including your current tabs and custom tag settings,
          will be lost. Back up your workspace first if you wish to restore it
          later.
        </h3>
      </div>
    </SettingsToggleWrapper>

    <SettingsSubmitWrapper>
      <div className="buttons">
        <button
          onClick={() => {
            /* Do nothing */
          }}
        >
          <FontAwesomeIcon icon={faFileImport} />
          Import Workspace
        </button>
      </div>
    </SettingsSubmitWrapper>
  </>
);
