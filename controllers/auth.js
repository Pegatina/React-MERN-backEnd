const { response } = require('express'); //Para recuperar el intellisense
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateJWT = require('../helpers/jwt');

const createUser = async (req, res = response) => {

    const { email, password } = req.body;

    //Manejo de errores
    // if (name.length < 3) {
    //     return res.status(400).json({
    //         ok: false,
    //         msg: 'El nombre debe tener mínimo 3 letras'
    //     })
    // };

    try {
        let user = await User.findOne({ email });
        // console.log(user);
        if (user) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe ese usuario.'
            });
        }

        user = new User(req.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();
        //Generar JWT
        const token = await generateJWT(user.id, user.name);

        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })
    } catch (error) {
        // console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor, hable con el administrador.'
        });
    }

};

const loginUser = async (req, res = response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        // console.log(user);
        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe un usuario con ese email.'
            });
        }
        //Confirmar las contraseñas
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta.'
            })
        }
        //Generar JWT
        const token = await generateJWT(user.id, user.name);

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })

    } catch (error) {
        // console.log(error);
        console.error('Error en loginUser:', error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor, hable con el administrador.'
        });
    }
};

const renewToken = async (req, res = response) => {

    const { uid, name } = req;

    const token = await generateJWT(uid, name);   

    res.json({
        ok: true,
        //    uid,
        //    name
        token
    })
}

module.exports = {
    createUser,
    loginUser,
    renewToken
};