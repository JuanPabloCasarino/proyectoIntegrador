import { Router } from 'express';
import passport from 'passport';
import UserModel from '../dao/models/user.model.js';
import { createHash, isValidPassword } from '../utils.js';
import initializePassport from '../config/passport.config.js'

const router = Router();

router.get('/github', passport.authenticate('github',{scope:['user:email']}), async (req, res) => {

})

router.get('/githubcallback', passport.authenticate('github',{failureRedirect:'/login'}), async (req, res) => {
    req.session.user = req.user;
    res.redirect('/')
})


export default router;