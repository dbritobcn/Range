describe('Range app', () => {
  describe('Exercise 2', () => {
    beforeEach(() => {
      cy.start('/exercise2');
    });

    it('should move min and max bullet and get the value', () => {
      cy.get('[data-testid=range]').should('exist');
      cy.get('[data-testid=minBullet]').should('exist');
      cy.get('[data-testid=minBullet]')
        .trigger('mousedown', 0, 0, { force: true })
        .trigger('mousemove', 100, 0, { force: true });
      cy.get('[data-testid=minBullet]')
        .click()
        .trigger('mouseup', {force: true});
      cy.get('[data-testid=minResult]').should('have.text', '30.99');
      cy.get('[data-testid=maxBullet]').should('exist');
      cy.get('[data-testid=maxBullet]')
        .trigger('mousedown', 0, 0, { force: true })
        .trigger('mousemove', -100, 0, { force: true });
      cy.get('[data-testid=maxBullet]')
        .click()
        .trigger('mouseup', {force: true});
      cy.get('[data-testid=maxResult]').should('have.text', '50.99');
    });

    it('should try to cross min and max bullet and not get it', () => {
      cy.get('[data-testid=range]').should('exist');
      cy.get('[data-testid=minBullet]').should('exist');
      cy.get('[data-testid=minBullet]')
        .trigger('mousedown', 0, 0, { force: true })
        .trigger('mousemove', 150, 0, { force: true });
      cy.get('[data-testid=minBullet]')
        .click()
        .trigger('mouseup', {force: true});
      cy.get('[data-testid=minResult]').should('have.text', '30.99');
      cy.get('[data-testid=maxBullet]').should('exist');
      cy.get('[data-testid=maxBullet]')
        .trigger('mousedown', 0, 0, { force: true })
        .trigger('mousemove', -170, 0, { force: true });
      cy.get('[data-testid=maxBullet]')
        .click()
        .trigger('mouseup', {force: true});
      cy.get('[data-testid=maxResult]').should('have.text', '30.99');
      cy.get('[data-testid=minResult]').should('have.text', '5.99');
    });
  });
});
