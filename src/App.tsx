import { useState } from 'react';
import { Entry } from '@polkadot-cloud/react';

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <Entry mode="light" theme={`polkadot-relay`}>
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
