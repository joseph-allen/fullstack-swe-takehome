describe('Home Page User abandons queue', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
  });

  it('walks through the app states', () => {
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
    cy.contains('Joining Queue').should('exist');
    cy.contains('Skip wait (dev button)').click();

    // Step 4: Check inQueue state
    cy.contains("You're in the queue").should('exist');
    cy.contains('Ready to Check In').click();

    // Step 5: Check readyToCheckIn state
    cy.contains('Reset').click();

    // Step 6: Should return to idle
    cy.contains('Get in the queue?').should('exist');
  });
});
