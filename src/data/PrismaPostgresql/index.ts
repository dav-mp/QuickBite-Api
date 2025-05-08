import { PrismaClient } from "@prisma/client";


export const prisma = new PrismaClient()

export class InitBD {


    constructor() {
        
    }

    static async initBdConnection() {

        try {

            await prisma.$connect()

            return Promise.resolve(true)
            
        } catch (error) {

            console.log(error);
            return Promise.reject({
                message: error,
                status: false
            })
            
        }
        
    }

}
