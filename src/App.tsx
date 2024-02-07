import { useState } from 'react';
import { Entry } from '@polkadot-cloud/react';
import { TabWrapper, TabsWrapper } from 'library/Tabs/Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { HeaderWrapper } from 'library/Header/Wrappers';
import ConsoleSVG from 'svg/Console.svg?react';
import { version } from '../package.json';
import { FooterWrapper } from 'library/Footer/Wrappers';
import { faHive } from '@fortawesome/free-brands-svg-icons';

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
        <h1>
          Polkadot Developer Console <span>{version}</span>
        </h1>
      </HeaderWrapper>
      <TabsWrapper>
        <TabWrapper className="active">Polkadot Relay</TabWrapper>
        <TabWrapper>Kusama Relay</TabWrapper>
        <TabWrapper>Westend Relay</TabWrapper>
        <TabWrapper>
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
        <h1>Vite + React</h1>
        <br />
        <button onClick={() => setCount((c) => c + 1)}>count is {count}</button>
      </div>

      <FooterWrapper>
        <div>Connected</div>
        <div>
          <FontAwesomeIcon icon={faHive} className="icon" />
          &nbsp; 1,234,567
        </div>
      </FooterWrapper>
    </Entry>
  );
};

export default App;
