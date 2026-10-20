import 'dotenv/config'
import { SignJWT, jwtVerify} from 'jose'
import { jwt, number } from 'zod';

const JwtKey = process.env.JWT_KEY;

if(!JwtKey){
    throw new Error("There aren't any JwtSecret in env files")
}

const key = Buffer.from(JwtKey,'hex')

export function createAccessToken(userId: number) {

    try {

        const result = new SignJWT({})
        .setProtectedHeader({alg: 'HS256',typ:"JWT"} )
        .setSubject(String(userId))
        .setIssuedAt()
        .setAudience('sobaixAudience')
        .setIssuer('sobaixIssuer')
        .setExpirationTime("30m")
        .sign(key,)

        return result;

    } catch (error) {
        throw new Error("Error signing the jwt key")
    }

}

export async function verifyAccessToken(token: string) {

    try {

        const {payload} = await jwtVerify(token,key, {
            algorithms: ["HS256"],
            audience: "sobaixAudience",
            issuer: "sobaixIssuer",
            requiredClaims: ["sub","iat","exp"]
        })

        return payload;

    } catch (error) {
        throw new Error("Error signing the jwt key")
    }

}






