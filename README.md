# Cypress GraphQL Mock Network

Simple network mocking for your GraphQL API.

This module provides a cypress wrapper for [GraphQL Mock Network](https://github.com/warrenday/graphql-mock-network)

## Installation

Install the module

`npm i cypress-graphql-mock-network`

Import this module within the support file of your cypress directory. `cypress/support/index.ts`

```ts
import 'cypress-graphql-mock-network';
```

(Important) Serve our custom service worker [./mockServiceWorker.js](./mockServiceWorker.js) from the root directory of your site. i.e. so it can be accessed in browser at `http://{{yourdomain}}/mockServiceWorker.js`.

Please note some modifications have been made to make this work with cypress. So please use the service worker from this repo specifically.

Now you are all setup to mock any graphql request from cypress :D

## Usage Example

You can find an example test suite within this repo at [./cypress/integration/home.spec.ts](./cypress/integration/home.spec.ts)

Run the mock network before each test, you can import the schema with `cy.readFile()`, which will read relative to the location of the `cypress.json` config file.

```ts
beforeEach(() => {
  cy.readFile('./introspection.schema.graphql').then(schema => {
    cy.mockNetwork({ schema });
  });

  // You may want to visit the same url for each test, in which case,
  // call cy.visit AFTER the network has been mocked.
  // cy.visit('http://localhost:3000');
});
```

Then within each test you can rely on the automatic mocking of the schema, or apply your own custom mocks.

```ts
it('displays initial list of todos', () => {
  cy.visit('http://localhost:3000');

  cy.mockNetworkAdd({
    Query: () => ({
      todos: () => ({
        data: [
          {
            id: '1',
            title: 'Go shopping',
            completed: true,
          },
        ],
      }),
    }),
  });

  cy.get('li')
    .eq(0)
    .contains(/Go shopping/)
    .should('exist');
});
```

## Commands

We provide three simple commands to support all your mocking needs.

### cy.mockNetwork()

Must be called before each test so call within the beforeEach callback. Accepts a GraphQL Schema and optionally some initial mocks.

```ts
beforeEach(() => {
  cy.readFile('./introspection.schema.graphql').then(schema => {
    cy.mockNetwork({ schema, mocks: {} });
  });
});
```

### cy.mockNetworkAdd()

Add additional mocks to those defined when initialising the mock network.

```ts
cy.mockNetworkAdd({
  Query: () => ({
    photo: () => ({
      id: 'abc',
      title: 'I am a manually mocked photo!',
    }),
    todo: () => ({
      id: 'xyz',
      title: 'I am a manually mocked todo!',
    }),
  }),
  Mutation: () => ({
    createPhoto: () => ({
      id: '1',
      title: 'Family Holiday',
      url: 'http://url.com',
      thumbnailUrl: 'http://url.com/thumbnail',
    }),
  }),
});
```

### cy.mockNetworkReset()

Reset mocks back to the state when `cy.mockNetwork()` was called.

```ts
cy.mockNetworkReset();
```

## Licence

The MIT License (MIT)

Copyright (c) 2020 Cypress GraphQL Mock Network Authors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
`
