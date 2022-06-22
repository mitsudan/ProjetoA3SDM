const mongoose = require('../database');
const bcrypt = require('bcryptjs');

const UsuarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    cpf: {
        type: String,
        require: true,
    },
    senha: {
        type: String,
        required: true,
        select: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

UsuarioSchema.pre('salvar', function(next) {
    const hash = await bcrypt.hash(this.senha, 10);
    this.senha = hash;

    next();
})

const Usuario = mongoose.model('Usuario', UsuarioSchema);

module.exports = Usuario;