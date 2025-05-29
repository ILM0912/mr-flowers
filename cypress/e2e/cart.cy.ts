describe('Корзина: добавление и отображение товаров', () => {
    beforeEach(() => {
        sessionStorage.clear();
        cy.intercept('GET', '/products', { fixture: 'products.json' });
        cy.intercept('GET', '/categories', { body: ['Букеты', 'Розы', 'Пионы'] });

        cy.visit('/');
    });

    it('добавляет товар в корзину', () => {
        cy.get('[data-cy=product_1]').within(() => {
            cy.get('[data-cy=cart-button]').click();
        });

        cy.visit('/cart');

        cy.contains(`Букет "Магический миг"`).should('exist');
        cy.get('[data-cy=quantity]').should('have.value', '1');
    });

    it('изменяет количество товаров в корзине', () => {
        cy.get('[data-cy=product_1]').within(() => {
            cy.get('[data-cy=cart-button]').click();
        });

        cy.visit('/cart');

        cy.get('[data-cy=quantity-increase]').click();
        cy.get('[data-cy=quantity]').should('have.value', '2');

        cy.get('[data-cy=quantity-decrease]').click();
        cy.get('[data-cy=quantity]').should('have.value', '1');

        cy.get('[data-cy=quantity]')
            .clear()
            .type('5')
            .should('have.value', '5');
    });

    it('удаляет товар из корзины', () => {
        cy.get('[data-cy=product_1]').within(() => {
            cy.get('[data-cy=cart-button]').click();
        });

        cy.visit('/cart');

        cy.get('[data-cy=cart-remove]').click();

        cy.contains(`Букет "Магический миг"`).should('not.exist');
    });
});
