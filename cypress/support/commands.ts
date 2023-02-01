/// <reference types="cypress" />
Cypress.Commands.add('start', (path = '') => {
  cy.visit(`http://localhost:8080${path}`)
});
