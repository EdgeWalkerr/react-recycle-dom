# react-recycle-dom

use portal to recycle dom to achieve performance

## install

```bash
yarn add react-recycle-dom
```

## how to use

bind Provider at the top level of the recycle dom and use inside it with Portal.Item name in eveywhere

```tsx
import {Provider, Portal} from "react-recycle-dom";
import React from 'react';
import Item from './Item';

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
```

## demo

https://codesandbox.io/s/react-recycle-dom-i4di7

### Prefer run demo in code?

```bash
cd example/basicUsage
yarn start
```

## todo

