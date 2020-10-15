import React from 'react';
import Item from './Item';
import { Portal, Provider } from "react-recycle-dom";

function App() {
  return (
    <Provider
      componentMap={{
        Item,
      }}
    >
      <Portal.Item color='blue' />
      <Portal.Item color='red' />
    </Provider>
  );
}

export default App;
