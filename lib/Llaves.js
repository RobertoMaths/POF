const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

const genKeypair = ()=> {
    const keypair = crypto.generateKeyPairSync("rsa",{
        modulusLength: 4096,
        publicKeyEncoding: {
            type: "pkcs1",
            format: "pem"
        }, 
        privateKeyEncoding : {
            type: "pkcs1",
            format: "pem"
        }
    })

    fs.writeFileSync(path.resolve(__dirname, "../plubic_key.pem"),keypair.publicKey)
    fs.writeFileSync(path.resolve(__dirname, "../priv_key.pem"),keypair.privateKey)
}

genKeypair()