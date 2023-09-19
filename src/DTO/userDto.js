const userDto = (user) => {
    const {firstname, lastname, email, age, rol} = user;
    const userFilter = {
        firstname,
        lastname,
        email,
        age,
        rol
    }
    return  userFilter;
}

export {userDto}