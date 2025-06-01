describe('Каталог', () => {
    beforeEach(() => {
        sessionStorage.clear();
        cy.intercept('GET', '/products', { fixture: "products.json" });
        cy.intercept('GET', '/categories', { body: ["Букеты", "Розы", "Пионы"] });
        cy.intercept('GET', '/product/74', { fixture: "detailed_product.json" });
        
        cy.visit('/');
    });

    it('отображает карточки', () => {
        cy.get('[data-cy=catalog]').should('exist');
    
        cy.get('[data-cy=product_1]').should('exist');
        cy.get('[data-cy=product_41]').should('exist');
        cy.get('[data-cy=product_74]').should('exist');
    });

    it('сортировка по рейтингу', () => {
        cy.get('[data-cy=sort-select]').select('По рейтингу');

        cy.get('[data-cy^=product_]').then(cards => {
            const ids = [...cards].map(card => card.getAttribute('data-cy'));
            expect(ids).to.deep.equal(['product_74', 'product_41', 'product_1']);
        });
    });

    it('сортировка по убыванию цены', () => {
        cy.get('[data-cy=sort-select]').select('Сначала дорогие');

        cy.get('[data-cy^=product_]').then(cards => {
            const ids = [...cards].map(card => card.getAttribute('data-cy'));
            expect(ids).to.deep.equal(['product_74', 'product_41', 'product_1']);
        });
    });

    it('сортировка по возрастанию цены', () => {
        cy.get('[data-cy=sort-select]').select('Сначала дешевые');

        cy.get('[data-cy^=product_]').then(cards => {
            const ids = [...cards].map(card => card.getAttribute('data-cy'));
            expect(ids).to.deep.equal(['product_1', 'product_41', 'product_74']);
        });
    });

    it('сортировка по алфавиту', () => {
        cy.get('[data-cy=sort-select]').select('По алфавиту');

        cy.get('[data-cy^=product_]').then(cards => {
            const ids = [...cards].map(card => card.getAttribute('data-cy'));
            expect(ids).to.deep.equal(['product_1', 'product_74', 'product_41']);
        });
    });

    it('фильтрация: категория "Букеты"', () => {
        cy.get('[data-cy=category-select]').select('Букеты');

        cy.get('[data-cy^=product_]').should('have.length', 1);
        cy.get('[data-cy=product_1]').should('exist');
    });

    it('фильтрация: категория "Розы"', () => {
        cy.get('[data-cy=category-select]').select('Розы');

        cy.get('[data-cy^=product_]').should('have.length', 1);
        cy.get('[data-cy=product_41]').should('exist');
    });

    it('фильтрация: категория "Пионы"', () => {
        cy.get('[data-cy=category-select]').select('Пионы');

        cy.get('[data-cy^=product_]').should('have.length', 1);
        cy.get('[data-cy=product_74]').should('exist');
    });

    it('открывает страницу товара при клике по карточке', () => {
        cy.get('[data-cy=product_74]').click();

        cy.url().should('include', '/product/74');

        cy.contains("Букет из 17 белых и розовых пионов");
        cy.contains("Пион белый, розовый дизайнерская упаковка.");
    });
});
