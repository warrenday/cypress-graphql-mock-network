import { MockNetwork } from 'graphql-mock-network';
import { IMocks } from 'graphql-tools';

const ALIAS = 'graphqlMockNetworkCommands';

export type MockNetworkOptions = {
  schema: string;
  mocks?: IMocks;
};

declare global {
  namespace Cypress {
    interface Chainable {
      mockNetwork(options?: MockNetworkOptions): void;
      mockNetworkAdd(mocks?: IMocks): void;
      mockNetworkReset(): void;
    }
  }
}

Cypress.Commands.add('mockNetwork', (opts: MockNetworkOptions) => {
  const { schema, mocks } = opts;
  const mockNetwork = new MockNetwork({
    schema,
    mocks,
  });
  mockNetwork.start();

  // Wrap methods to be called by other cypress commands
  cy.wrap({
    mockNetworkAdd: (mocks: IMocks) => {
      mockNetwork.addMocks(mocks);
    },
    mockNetworkReset: () => {
      mockNetwork.resetMocks();
    },
  }).as(ALIAS);
});

Cypress.Commands.add('mockNetworkAdd', (mocks: IMocks) => {
  cy.get(`@${ALIAS}`).invoke('mockNetworkAdd', mocks);
});

Cypress.Commands.add('mockNetworkReset', () => {
  cy.get(`@${ALIAS}`).invoke('mockNetworkAdd');
});
