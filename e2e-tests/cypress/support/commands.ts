// cypress/support/commands.d.ts
declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to reset the database and populate it with test data.
     */
    resetDatabase(): Chainable<void>;
  }
}


Cypress.Commands.add('resetDatabase', () => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:3000/auth/token',
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      username: 'admin',
      password: 'p',
    },
  }).then((response) => {
    const accessToken = response.body.access_token;

    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/dev/db_populate',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }).then((dbResponse) => {
      // expect(dbResponse.status).to.eq(200);
    });
  });
});
