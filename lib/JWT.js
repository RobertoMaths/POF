const base64 = require("base64url");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

const PUBLIC_KEY = fs.readFileSync(path.resolve(__dirname,"../public_key.pem"),"utf-8");
const PRIVATE_KEY = fs.readFileSync(path.resolve(__dirname,"../priv_key.pem"),"utf-8");

const headerInBase64UrlFormat = base64(JSON.stringify({
    alg: "RS256",
    typ: "JWT"
}));

const crearJWT = (usuario)=> {
    const signatureFunc = crypto.createSign("RSA-SHA256");
    const payloadInBase64UrlFormat = base64(JSON.stringify({
        sub: `${usuario}`,
    }));
    signatureFunc.write(headerInBase64UrlFormat + "." + payloadInBase64UrlFormat);
    signatureFunc.end();
    const signatureInBase64Format = signatureFunc.sign(PRIVATE_KEY,"base64");
    const signatureInBase64UrlFormat = base64.fromBase64(signatureInBase64Format);
    return headerInBase64UrlFormat + "." + payloadInBase64UrlFormat + "." + signatureInBase64UrlFormat;
};

const verificarJWT = (req,res,next)=> {
    try {
        if (!req.headers.cookie) {
            req.sesión = false;
            return next();
        };
        const JWT = req.headers.cookie.slice(13,req.headers.cookie.length);
        const [header,payload,signature] = JWT.split(".");
        const verifyFunc = crypto.createVerify("RSA-SHA256");
        verifyFunc.write(header + "." + payload);
        verifyFunc.end()
        const signatureInBase64Format = base64.toBase64(signature);
        const JWTVálido = verifyFunc.verify(PUBLIC_KEY,signatureInBase64Format,"base64");
        if (!JWTVálido) {
            res.set({
                "Set-Cookie": "autorizacion=; Max-Age=0"
            });
            return res.redirect("/login");
        }
        else {
            req.sesión = JWTVálido;
            req.usuario = JSON.parse(base64.decode(payload)).sub;
            return next();
        }
    }
    catch(e) {
        console.log(e);
        return res.redirect("/login");
    }
};

module.exports = {
    crearJWT,
    verificarJWT
};