describe('Home Page User abandons queue', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
  });

  it('1. walks through the app states', () => {
    // Step 1: Check we're on idle state
    cy.contains('Get in the queue?').should('exist');
    cy.contains('Join queue').click();

    // Step 2: Check showForm state
    cy.get('form').should('exist');
    cy.get('form').within(() => {
      cy.get('input').first().type('The Smiths');
      cy.root().submit();
    });

    // Step 3: Check formSubmitted state
    cy.wait(20 * 1000);

    // Step 4: Check inQueue state
    cy.contains('Your table is ready,').should('exist');
    cy.contains('Check In').click();

    // Step 5: Check "Checked in"
    cy.contains('Thanks for visiting').should('exist');
  });
});
