import {faker} from '@faker-js/faker/faker/locale/es';

faker.setLocale('es');

export const generateUser = () => {

    let carts = []
    return {
        name: faker.firstName(),
        lastName: faker.lastName(),
        email: faker.email(),
        age: faker.age(),
        password: faker.password(length=10),
        rol: "usuario",
        carts: carts
        
    }
}