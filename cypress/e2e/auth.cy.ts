describe('Личный кабинет', () => {
    beforeEach(() => {
        sessionStorage.clear();

        cy.intercept('POST', '/login', {
            statusCode: 200,
            body: {
                user: {
                    email: 'testuser@example.com', 
                    name: 'Test',
                    bonuses: 500,
                    address: [],
                    orders: [],
                    defaultAddress: null
                }
            },
        });

        cy.intercept('POST', '/register', {
            statusCode: 200,
            body: {
                user: {
                    email: 'testuser@example.com', 
                    name: 'Test',
                    bonuses: 500,
                    address: [],
                    order: [],
                    defaultAddress: null
                }
            },
        });

        cy.intercept('GET', '/products', {
            fixture: 'products.json',
        });

        cy.intercept('POST', '/cart/update', {
            statusCode: 200,
            body: {
                cart: [{
                    product: {
                        "category": "Розы",
                        "id": "41",
                        "image": "/images/41.webp",
                        "name": "Букет из 19 белых метровых роз",
                        "price": 7890,
                        "rating": 3.5,
                        "reviews_length": 2
                    },
                    quantity: 2
                }]
            }
        });

        cy.visit('/profile');
    });

    it('регистрирует пользователя', () => {
        cy.get('[data-cy=tab]').click();

        cy.get('[data-cy=email]').type('testuser@example.com');
        cy.get('[data-cy=password]').type('testpassword');
        cy.get('[data-cy=repeat-password]').type('testpassword');
        cy.get('[data-cy=submit]').click();

        cy.get('[data-cy=profile-email]').should('contain', 'testuser@example.com');
    });

    it('логинит и синхронизирует корзину', () => {

        cy.get('[data-cy=email]').type('testuser@example.com');
        cy.get('[data-cy=password]').type('testpassword');
        cy.get('[data-cy=submit]').click();

        cy.get('[data-cy=profile-email]').should('contain', 'testuser@example.com');

        cy.visit('/cart');

        cy.get('[data-cy=cart-item_41]').should('exist');
        cy.get('[data-cy=quantity]').should('have.value', '2');
    });
});
