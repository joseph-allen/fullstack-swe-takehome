describe('home page', () => {
  beforeEach(() => {
    // Visit the home page before each test
    // Note: Ensure your app is running on localhost:3000
    cy.visit('http://localhost:3000/');
  });

  it('displays a single button', () => {
    // Check button is present
    cy.get('button').should('exist');

    // Check button has correct text
    cy.get('button').should('have.text', 'Join queue');
    cy.get('button').should('have.length', 1);
  });
});
