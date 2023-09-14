import Point from './components/Point';
import './App.css';

import { CosmapStargateClient } from './cosmap-client/src/cosmap_stargateclient';

function App() {
  return (
    <>
      <header className="App-header">
        <h1> Cosmap </h1>
      </header>
      <div id='map'>
        <Point x={0} y={500} type='city' />
      </div>
    </>
  );
}

export default App;
