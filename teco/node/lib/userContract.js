'use strict';
const { Contract, Context } = require('fabric-contract-api');

class UserContract extends Contract {

    async initUser(ctx) {
        console.log('init User');
        const userAssets = [
            {
                userId: 'US0001',
                username: 'usertest',
                password: this._hashCode('password'),
                email: 'test@example.com',
                address: '123 Duy Tan, VN',
                role: 'admin',
                manager: '',
                org: 'supply',
                docType: 'user'
            }
        ]
        for (let index = 0; index < userAssets.length; index++) {
            userAssets[index].docType = 'product';
            await ctx.stub.putState(userAssets[index].userId, Buffer.from(JSON.stringify(userAssets[index])));
            console.log('add product ---------------------> ', userAssets[index].userId);
        }
        console.log('initProductLedger done ============');
    }

    async createUser(ctx, userId, username, fullname, password, email, address, role, manager, org) {
        const user = {
            userId: userId,
            username: username,
            fullname: fullname,
            password: this._hashCode(password),
            email: email,
            address: address,
            role: role,
            manager: manager,
            org: org,
            docType: 'user'
        }
        try {
            await ctx.stub.putState(userId, Buffer.from(JSON.stringify(user)));
            return JSON.stringify(user);
        } catch (error) {
            throw new Error(error);
        }
    }

    async queryUser(ctx, userId) {
        const user = ctx.stub.getState(userId);
        if (!user || user.length === 0)
            throw new Error(`User ${userId} doesn't exists in the system!`);
        return user.toString();
    }

    async queryAllUserByManager(ctx, manager) {
        const startKey = '';
        const endKey = '';
        const allUsers = [];
        for await (const { key, value } of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
                if (record.manager === manager) {
                    allUsers.push({ Key: key, Value: record });
                }
            } catch (error) {
                console.log(error);
            }
        }
        console.log(allUsers);
        return JSON.stringify(allUsers);
    }

    async changePassword(ctx, userId, newPassword) {
        const user = ctx.stub.getState(userId);
        if (!user || user.length === 0)
            throw new Error(`User ${userId} doesn't exists in the system!`);
        if (user.password === this._hashCode(newPassword)) {
            throw new Error(`Password same with your old password, please try another password!`);
        }
        user = JSON.parse(user.toString());
        user.password = this._hashCode(newPassword);
        await ctx.stub.putState(userId, Buffer.from(JSON.stringify(user)));
        return JSON.stringify(user);
    }

    async changeUserInformation(ctx, userId, fullname, email, address, role, manager, org) {
        const user = ctx.stub.getState(userId);
        if (!user || user.length === 0) {
            throw new Error(`User ${userId} doesn't exists in the system!`);
        }
        user = JSON.parse(user.toString());

        user.fullname = fullname ? fullname : user.fullname;
        user.email = email ? email : user.email;
        user.address = address ? address : user.address;
        user.role = role ? role : user.role;
        user.manager = manager ? manager : user.manager;
        user.org = org ? org : user.org;

        await ctx.stub.putState(userId, Buffer.from(JSON.stringify(user)));
        return JSON.stringify(user);
    }

    async login(ctx, userId, password) {
        const user = ctx.stub.getState(userId);
        if (!user || user.length === 0)
            throw new Error(`User ${userId} doesn't exists in the system!`);
        user = JSON.parse(user.toString());
        if (user.password === this._hashCode(password)) {
            return true;
        }
        return false;
    }

    _hashCode = function (password) {
        var hash = 0, i, chr;
        if (password.length === 0) return hash;
        for (i = 0; i < password.length; i++) {
            chr = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0;
        }
        return hash;
    };
}

module.exports = UserContract;