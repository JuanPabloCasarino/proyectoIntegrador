import passport from 'passport';
import local from 'passport-local'
import UserModel from '../dao/models/user.model.js';
import {
    createHash,
    isValidPassword
} from '../utils.js';

const LocalStrategy = local.Strategy;
const initializePassport = () => {
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const {
            firstname,
            lastname,
            email,
            age,
        } = req.body;
        try {
            let user = await UserModel.findOne({
                email: username
            })
            if (user) {
                console.log('El usuario ya existe');
                return done(null, false)
            }
            const newUser = {
                firstname,
                lastname,
                email,
                age,
                password: createHash(password),
                rol: 'usuario'
            }
            let result = await UserModel.create(newUser)
            return done(null, result)
        } catch (error) {
            return done('Error al obtener el usuario: ' + error)
        }
    }))
    
    passport.serializeUser = ((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser = (async (id, done) => {
        let user = await UserModel.findByID(id)
        done(null, user)
    })
    
    passport.use('login', new LocalStrategy({usernameField: 'email'}, async (username, password, done) => {
        try {
            const user = await UserModel.findOne({email: username})
            if (!user) {
                console.log('User does not exist')
                return done(null, false)
            }
            if (!isValidPassword(user, password)) return done(null, false)
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }))
}
export default initializePassport