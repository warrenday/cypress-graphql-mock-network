import { MockNetwork, IMockPayload } from 'graphql-mock-network';

const ALIAS = 'graphqlMockNetworkCommands';

export type MockNetworkOptions = {
  schema: string;
  mocks?: IMockPayload;
};

declare global {
  namespace Cypress {
    interface Chainable {
      mockNetwork(options?: MockNetworkOptions): void;
      mockNetworkAdd(mocks?: IMockPayload): void;
      mockNetworkReset(): void;
      mockNetworkStop(): void;
    }
  }
}

Cypress.Commands.add('mockNetwork', (opts: MockNetworkOptions) => {
  const { schema, mocks } = opts;
  const mockNetwork = new MockNetwork({
    schema,
    mocks,
  });

  // Wrap methods to be called by other cypress commands
  cy.wrap({
    mockNetworkAdd: (mocks: IMockPayload) => {
      mockNetwork.addMocks(mocks);
    },
    mockNetworkReset: () => {
      mockNetwork.resetMocks();
    },
    mockNetworkStop: () => {
      mockNetwork.stop();
    },
  }).as(ALIAS);

  // A timeout may be required when registering the service worker for the first time only.
  cy.wrap(null).then({ timeout: 10000 }, () => {
    return mockNetwork.start();
  });
});

Cypress.Commands.add('mockNetworkAdd', (mocks: IMockPayload) => {
  cy.get(`@${ALIAS}`).invoke('mockNetworkAdd', mocks);
});

Cypress.Commands.add('mockNetworkReset', () => {
  cy.get(`@${ALIAS}`).invoke('mockNetworkReset');
});

Cypress.Commands.add('mockNetworkStop', () => {
  cy.get(`@${ALIAS}`).invoke('mockNetworkStop');
});
