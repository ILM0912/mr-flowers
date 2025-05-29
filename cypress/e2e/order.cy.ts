import {Order, User} from '../../src/types'

describe('OrderForm', () => {
    const items = [{
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
    }];

    const user : User = {
        email: 'testuser@example.com', 
        name: 'Тест',
        bonuses: 500,
        address: [],
        orders: [],
        defaultAddress: null
    };

    const order : Order = {
        id: 0,
        items: [],
        deliveryAddress: '',
        deliveryDate: '',
        deliveryTime: '',
        phone: '',
        bonusesToUse: 0,
        total: 0,
        finalTotal: 0,
        email: '',
        createdAt: ''
    }

    beforeEach(() => {
        cy.intercept('POST', '/order/create', order);
        cy.intercept('POST', '/checkPromo', { statusCode: 200, body: { discount: 10, message: 'Промокод принят' } });
        cy.intercept('POST', '/login', {
            statusCode: 200,
            body: {user: user},
        });
        cy.intercept(
            {
                method: 'GET',
                url: '/user',
                query: { email: 'testuser@example.com' }
            },
            {
                statusCode: 200,
                body: user
            }
        );
        cy.intercept('POST', '/cart/update', {
            statusCode: 200,
            body: {
                cart: items
            }
        });

        cy.visit('/')
    });

    it('Авторизованный пользователь оформляет заказ', () => {
        cy.visit('/profile');

        cy.get('[data-cy=email]').type('testuser@example.com');
        cy.get('[data-cy=password]').type('testpassword');
        cy.get('[data-cy=submit]').click();

        cy.get('[data-cy=profile-email]').should('contain', 'testuser@example.com');

        cy.visit('/cart');
        cy.contains("Букет из 19 белых метровых роз").should('exist');
        cy.contains(/Перейти/).click();
        cy.contains("Букет из 19 белых метровых роз").should('exist');

        cy.get('input[placeholder="Введите адрес доставки"]').type('тверь');

        cy.get('input[type=tel]').type('7 999 123 45 67');

        cy.get('select').select('09:00');

        cy.get('input[type=checkbox]').check();

        cy.get('input[placeholder*="промокод"]').type('MITAL');
        cy.contains('Применить').click();

        cy.get('button').contains(/Заказать/).should('not.be.disabled');

        cy.get('button').contains(/Заказать/).click();

        cy.contains('Заказ').should('exist');
    });

    it('Неавторизованный пользователь оформляет заказ', () => {
        cy.get('[data-cy=product_41]').within(() => {
            cy.get('[data-cy=cart-button]').click();
        });

        cy.visit('/cart');
        cy.contains("Букет из 19 белых метровых роз").should('exist');
        cy.contains(/Перейти/).click();

        cy.contains('Войдите в аккаунт').should('exist');

        cy.get('input[type=tel]').type('7 999 123 45 67');

        cy.get('input[placeholder*="адрес"]').type('ул. Независимости, 15');

        cy.get('select').select('09:00');

        cy.get('button').contains(/Заказать/).should('not.be.disabled');

        cy.get('button').contains(/Заказать/).click();

        cy.contains('Заказ').should('exist');
    });
});
