import { Router } from 'express';
import passport from 'passport';
import { current, gitHubCallback } from '../controllers/session.controller.js';

const router = Router();

router.get('/github', passport.authenticate('github',{scope:['user:email']}), async (req, res) => {})

router.get('/githubcallback', passport.authenticate('github',{failureRedirect:'/login'}), gitHubCallback)

router.get('/current', passport.authenticate('jwt', {session: false}), current)

export default router;