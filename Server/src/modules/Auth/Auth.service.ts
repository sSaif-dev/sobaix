import { prisma } from '../../database/prisma'
import { LoginDTO, SignUpDTO } from './Auth.DTOs';
import * as argon2 from 'argon2'
import { createAccessToken, verifyAccessToken, createRefreshToken, hashRefreshToken } from '../../Security/token';
import { gt } from 'zod';

export async function LoginService(loginData: LoginDTO, sessionDetails: any) {

    const user = await prisma.user.findUnique({
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

    const sessionExpiresAt = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
    );

    const refreshTokenExpiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
    );


    const trans = await prisma.$transaction(async tx => {

        const newSession = await tx.userSession.create({
            data: {
                UserId: user.Id,
                ExpiresAt: sessionExpiresAt,
                UserAgent: sessionDetails.UserAgent,
                IpAddress: sessionDetails.IpAddress

            }
        })

        const refreshToken = createRefreshToken();
        const hashedRefreshToken = hashRefreshToken(refreshToken);

        await tx.refreshToken.create({
            data: {
                SessionId: newSession.Id,
                TokenHash: hashedRefreshToken,
                ExpiresAt: refreshTokenExpiresAt

            }
        })


        const Token = await createAccessToken(user.Id, newSession.Id)

        return {
            userId: user.Id,
            AccessToken: Token,
            RefreshToken: refreshToken
        }

    })


    return trans
}




export async function SignUpService(dto: SignUpDTO) {

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






export async function refreshTokenService(rt: string) {

    const hashedRefreshToken = hashRefreshToken(rt);

    const refreshRecord = await prisma.refreshToken.findUnique({
        where: {
            TokenHash: hashedRefreshToken
        }
        ,
        include: {
            Session: true
        }
    })

    if (
        !refreshRecord ||
        refreshRecord.ExpiresAt.getTime() <= Date.now() ||
        refreshRecord.UsedAt !== null ||
        refreshRecord.Session.ExpiresAt.getTime() <= Date.now() ||
        refreshRecord.Session.RevokedAt !== null
    ) {
        return null
    }

    const trans = await prisma.$transaction(async tx => {

        const isUpdated = await tx.refreshToken.updateMany({
            where: {
                Id: refreshRecord.Id,
                UsedAt: null,
                ExpiresAt: { gt: new Date() }
            },
            data: {
                UsedAt: new Date(Date.now())
            }
            
        })

        if(isUpdated.count !== 1){
            return null
        }

        const newRefreshToken = createRefreshToken();
        const newHashedRefreshToken = hashRefreshToken(newRefreshToken)

        const expiresAt = new Date(
            Math.min(
                Date.now() + 7 * 24 * 60 * 60 * 1000,
                refreshRecord.Session.ExpiresAt.getTime()
            )
        ); 
        await tx.refreshToken.create({
            data: {
                SessionId: refreshRecord.SessionId,
                ExpiresAt: expiresAt,
                TokenHash: newHashedRefreshToken
            }
        })

        const newAccessToken = await createAccessToken(refreshRecord.Session.UserId, refreshRecord.SessionId)

        return {
            AccessToken: newAccessToken,
            RefreshToken: newRefreshToken
        }


    })

    return trans;

}

export async function isValidSessionIdService(sessionId: number, userId: number):Promise<boolean>{

    const session = await prisma.userSession.findUnique({
        where:{
            Id: sessionId,
            UserId: userId,
            RevokedAt: null,
            ExpiresAt: {gt: new Date()}
        }
        ,
        select:{
            Id:true
        }
    })

    return session !== null;

}