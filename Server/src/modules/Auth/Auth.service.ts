import { prisma } from '../../database/prisma'
import { LoginDTO, SignUpDTO } from './Auth.DTOs';
import * as argon2 from 'argon2'
import { createAccessToken, verifyAccessToken } from '../../Security/token';

export async function LoginMethod(loginData: LoginDTO) {



    const user = await prisma.user.findFirst({
        where: {
            UserName: loginData.email
        },
        select: {
            Id: true,
            Password: true
        }
    });

    if (!user) {
        return null;
    }


    const isValid = await argon2.verify(user.Password!, loginData.password);

    if (!isValid) {

        return null;
    }

    const Token = await createAccessToken(user.Id)

    return {
        userId: user.Id,
        token: Token
    }





}


export async function SignUpMethod(dto: SignUpDTO) {


    const isValid = await prisma.user.findUnique({
        where: {
            UserName: dto.username
        }
    })

    if (isValid) {

        return null;

    }
    const hashedPassword = await argon2.hash(dto.password, {
        type: argon2.argon2id
    });

    const user = await prisma.user.create({
        data: {
            UserName: dto.username,
            Password: hashedPassword,
            Role: 'User',
        }
    });

    return {
        data: user.Id
    };

}