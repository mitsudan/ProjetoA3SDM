const bcrypt = require('bcryptjs');
const express = require('express');
const { modelNames } = require('mongoose');
const jwt = requir('jsonwebtoken');

const authConfig = require('../config/auth.json');

const User = require('../models/user');

const router = express.Router();

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 3600,
    });
}

router.post('/register', async (req, res) => {
    const { email } = req.body;
    
    try {
        if (await User.findOne({ email })) {
            return res.send(400).send({ error: 'Usuário já existe!'})
        }
        
        const user = await User.create(req.body);

        user.senha = undefined;

        return res.send({ 
            user,
            token: generateToken({ id: user.id }),
        });
    } catch (err) {
        return res.status(400).send({ error: 'Falha ao resgistar!' });
    }
});

router.post('/authenticate', async (req, res) => {
    const { email, senha } = req.body;

    const user = await User.findOne({ email }). select('+senha');

    if (!user) {
        return res.status(400).send({ error: 'Usuário não encontrado!'});
    }

    if (!await bcrypt.compare(senha, user.senha)) {
        return res.status(400).send({ error: 'Senha inválida!'});
    }

    user.senha = undefined;
    
    res.send({ 
        user,
        token: generateToken({ id: user.id }),
    });
})


modelNames.exports = app => app.use('/auth', router);