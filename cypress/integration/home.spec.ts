describe('Home Page', () => {
  beforeEach(() => {
    cy.readFile('./introspection.schema.graphql').then(schema => {
      cy.mockNetwork({ schema });
      cy.visit('http://localhost:3000', {
        onBeforeLoad: win => {
          win.onerror = null;
        },
      });
    });
  });

  it('displays initial list of todos', () => {
    cy.mockNetworkAdd({
      Query: () => ({
        todos: () => ({
          data: [
            {
              id: '1',
              title: 'Go shopping',
              completed: true,
            },
            {
              id: '2',
              title: 'Clean the house',
              completed: false,
            },
          ],
        }),
      }),
    });

    cy.get('li')
      .eq(0)
      .contains(/Go shopping/)
      .should('exist');
    cy.get('li')
      .eq(1)
      .contains(/Clean the house/)
      .should('exist');
  });
});
