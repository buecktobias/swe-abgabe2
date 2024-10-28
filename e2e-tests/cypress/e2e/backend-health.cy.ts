describe('Backend Health Check', () => {
  it('should verify that the backend is reachable and healthy', () => {
    cy.request('http://localhost:3000/health/liveness')
      .its('status')
      .should('equal', 200);

    cy.request('http://localhost:3000/health/liveness')
      .its('body')
      .should((body) => {
        expect(body.status).to.equal('ok');
        expect(body).to.have.property('info');
        expect(body).to.have.property('details');
      });
  });
});
