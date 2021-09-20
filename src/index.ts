import { MockNetwork } from 'graphql-mock-network';
import { IGraphqlMocks } from 'graphql-mock-network/dist/types/types';

const ALIAS = 'graphqlMockNetworkCommands';

export type MockNetworkOptions = {
  schema: string;
  mocks?: IGraphqlMocks;
};

declare global {
  namespace Cypress {
    interface Chainable {
      mockNetwork(options?: MockNetworkOptions): void;
      mockNetworkAdd(mocks?: IGraphqlMocks): void;
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
    mockNetworkAdd: (mocks: IGraphqlMocks) => {
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

Cypress.Commands.add('mockNetworkAdd', (mocks: IGraphqlMocks) => {
  cy.get(`@${ALIAS}`).invoke('mockNetworkAdd', mocks);
});

Cypress.Commands.add('mockNetworkReset', () => {
  cy.get(`@${ALIAS}`).invoke('mockNetworkReset');
});

Cypress.Commands.add('mockNetworkStop', () => {
  cy.get(`@${ALIAS}`).invoke('mockNetworkStop');
});
