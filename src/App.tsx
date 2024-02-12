// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Entry } from '@polkadot-cloud/react';
import { TabWrapper, TabsWrapper } from 'library/Tabs/Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useTabs } from 'contexts/Tabs';
import { Header } from 'library/Header';
import { Footer } from 'library/Footer';
import { Tab } from 'library/Tabs/Tab';
import { Menu } from 'library/Menu';

export const App = () => {
  const { tabs, getActiveTab, createTab } = useTabs();

  return (
    <Entry mode="light" theme={`polkadot-relay`}>
      {/* Menu: closed by default */}
      <Menu />

      <Header />
      <TabsWrapper>
        {tabs.map(({ id, name }, index: number) => (
          <Tab key={`tab_${index}}`} id={id} name={name} index={index} />
        ))}
        <TabWrapper onClick={() => createTab()} className="new">
          <FontAwesomeIcon icon={faPlus} className="icon" /> New
        </TabWrapper>
      </TabsWrapper>

      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h1>{getActiveTab()?.name || 'No ActiveTab'}</h1>
      </div>

      <Footer />
    </Entry>
  );
};
