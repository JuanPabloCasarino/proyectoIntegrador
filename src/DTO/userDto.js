const userDto = (user) => {
    const {firstname, lastname, email, age} = user;
    const userFilter = {
        firstname,
        lastname,
        email,
        age
    }
    return  userFilter;
}

export {userDto}