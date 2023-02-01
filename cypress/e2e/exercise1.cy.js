describe('Range app', () => {
  describe('Exercise 1', () => {
    beforeEach(() => {
      cy.start('/exercise1');
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
      cy.get('[data-testid=minResult]').invoke('text').then(parseFloat).should('be.greaterThan', 25);
      cy.get('[data-testid=minResult]').invoke('text').then(parseFloat).should('be.lessThan', 30);
      cy.get('[data-testid=maxBullet]').should('exist');
      cy.get('[data-testid=maxBullet]')
        .trigger('mousedown', 0, 0, { force: true })
        .trigger('mousemove', -100, 0, { force: true });
      cy.get('[data-testid=maxBullet]')
        .click()
        .trigger('mouseup', {force: true});
      cy.get('[data-testid=maxResult]').invoke('text').then(parseFloat).should('be.greaterThan', 65);
      cy.get('[data-testid=maxResult]').invoke('text').then(parseFloat).should('be.lessThan', 70);
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
      cy.get('[data-testid=minResult]').invoke('text').then(parseFloat).should('be.greaterThan', 40);
      cy.get('[data-testid=minResult]').invoke('text').then(parseFloat).should('be.lessThan', 45);
      cy.get('[data-testid=maxBullet]').should('exist');
      cy.get('[data-testid=maxBullet]')
        .trigger('mousedown', 0, 0, { force: true })
        .trigger('mousemove', -170, 0, { force: true });
      cy.get('[data-testid=maxBullet]')
        .click()
        .trigger('mouseup', {force: true});
      cy.get('[data-testid=maxValueInput]').type('{downarrow}');
      cy.get('[data-testid=maxValueInput]').type('{downarrow}');
      cy.get('[data-testid=maxValueInput]').type('{downarrow}');
      cy.get('[data-testid=maxValueInput]').type('{downarrow}');
      cy.get('[data-testid=maxValueInput]').type('{downarrow}');
      cy.get('[data-testid=maxValueInput]').type('{downarrow}');
      cy.get('[data-testid=maxValueInput]').type('{downarrow}');
      cy.get('[data-testid=maxValueInput]').type('{downarrow}');
      cy.get('[data-testid=maxValueInput]').type('{downarrow}');
      cy.get('[data-testid=maxValueInput]').type('{enter}');
      cy.get('[data-testid=maxResult]').invoke('text').then(parseFloat).should('be.greaterThan', 43);
    });

    it('should type a value and accept', () => {
      cy.get('[data-testid=range]').should('exist');
      cy.get('[data-testid=maxValueInput]').type('{backspace}');
      cy.get('[data-testid=maxValueInput]').type('{backspace}');
      cy.get('[data-testid=maxValueInput]').type('{backspace}');
      cy.get('[data-testid=maxValueInput]').type('3');
      cy.get('[data-testid=maxValueInput]').type('4');
      cy.get('[data-testid=maxValueInput]').type('{enter}');
      cy.get('[data-testid=maxResult]').should('have.text', '34');
    });

    it('should type a value and cancel', () => {
      cy.get('[data-testid=range]').should('exist');
      cy.get('[data-testid=maxValueInput]').type('{backspace}');
      cy.get('[data-testid=maxValueInput]').type('{backspace}');
      cy.get('[data-testid=maxValueInput]').type('{backspace}');
      cy.get('[data-testid=maxValueInput]').type('3');
      cy.get('[data-testid=maxValueInput]').type('4');
      cy.get('[data-testid=maxValueInput]').type('{esc}');
      cy.get('[data-testid=maxResult]').should('have.text', '100');
    });
  });
});
