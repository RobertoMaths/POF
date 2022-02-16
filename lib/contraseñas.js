const bcrypt = require("bcryptjs");

const genContraseña = (contraseña)=> {
    const hash = bcrypt.hashSync(contraseña,14);
    return hash;
}

const validContraseña = (contraseña, hash)=> {
    const válido = bcrypt.compareSync(contraseña, hash);
    return válido;
}

module.exports = {
    genContraseña,
    validContraseña
}