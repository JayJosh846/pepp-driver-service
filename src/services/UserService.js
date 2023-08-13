const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()



class UserService {
    
    static async addUser(newUser) {
        return await prisma.driver.create({ data: newUser }); 
    }

    static async findRider(id) {
        return await prisma.rider.findUnique(
            { 
                where: { 
                    id  
                }})
    }


    static async findUser(id) {
        return await prisma.driver.findUnique(
            { 
                where: { 
                    id  
                }})
    }

    static async findUserByPhone(id) {
        return await prisma.driver.findUnique(
            { 
                where: { 
                    mobile: id 
                }})
    }

    static async findUserByEmail(id) {
        return await prisma.driver.findUnique(
            { 
                where: { 
                    email: id 
                }})
    }

    static async updateUser(id, data) {
        return await prisma.driver.update({
            where: {
                id
            },
            data
        })
    }

    static async updateUserByPhone(id, data) {
        return await prisma.driver.update({ 
            where: { 
                mobile: id 
            }, 
              data
            })
    }

    static async updateUserByEmail(id, data) {
        return await prisma.driver.update({
            where: {
                email: id
            },
            data
        })
    }

    
}

module.exports = UserService;
