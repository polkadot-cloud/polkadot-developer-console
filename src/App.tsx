import { useState } from 'react';
import { Entry } from '@polkadot-cloud/react';
import { TabWrapper, TabsWrapper } from 'library/Tabs/Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { HeaderWrapper } from 'library/Header/Wrappers';
import ConsoleSVG from 'svg/Console.svg?react';

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <Entry mode="light" theme={`polkadot-relay`}>
      <HeaderWrapper>
        <ConsoleSVG
          style={{
            width: '1.25rem',
            marginRight: '0.5rem',
            fill: 'url(#console-gradient) var(--accent-color-primary)',
          }}
        />
        <h1>Polkadot Developer Console</h1>
      </HeaderWrapper>
      <TabsWrapper>
        <TabWrapper>Polkadot Relay</TabWrapper>
        <TabWrapper>Kusama Relay</TabWrapper>
        <TabWrapper>Westend Relay</TabWrapper>
        <TabWrapper>
          <FontAwesomeIcon icon={faPlus} className="icon" /> New
        </TabWrapper>
      </TabsWrapper>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((c) => c + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </Entry>
  );
};

export default App;
