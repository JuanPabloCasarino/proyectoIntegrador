import {
    faker
} from '@faker-js/faker/locale/es';


export const generateProducts = () => {
    return {
            title: faker.commerce.product(),
            price: faker.commerce.price({min:5, max: 100}),
            description: faker.commerce.productDescription,
            stock: faker.random.numeric(2),
            code: faker.string.alpha(6),
            category: faker.commerce.productAdjective(),
    }
}