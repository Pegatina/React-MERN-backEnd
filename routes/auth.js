/*
Rutas de usuarios / Auth
host + /api/auth
 */
const { Router } = require('express');
const { check } = require('express-validator');
const { validateJWT } = require('../middlewares/validate-jwt');
const router = Router();

const { createUser, loginUser, renewToken } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');

router.post(
    '/register',
    [ //middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La contraseña debe contener mínimo 6 caracteres').isLength({ min: 6 }),
        validateFields
    ],
    createUser
);
router.post('/',
    // console.log('Se requiere el /');
    [ //middlewares       
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La contraseña debe contener mínimo 6 caracteres').isLength({ min: 6 }),
        validateFields
    ],
    loginUser
);
router.get('/renew', validateJWT, renewToken);

module.exports = router;