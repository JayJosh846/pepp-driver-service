const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()



class WalletService {
    
    static async createWallet(newWallet) {
        return await prisma.wallets.create({
             data: newWallet 
            }); 
    }

    static async findDriverWallet(id) {
        return await prisma.wallets.findUnique(
            { 
                where: { 
                    driverId: id  
                }})
    }

    static async findRiderWallet(id) {
        return await prisma.wallets.findUnique(
            { 
                where: { 
                    riderId: id  
                }})
    }

    static async updateDriverWallet(id, data) {
        return await prisma.wallets.update({ 
            where: { 
                driverId: id 
            }, 
              data
            })
    }

    static async updateRiderWallet(id, data) {
        return await prisma.wallets.update({ 
            where: { 
                riderId: id 
            }, 
              data
            })
    }

}

module.exports = WalletService;