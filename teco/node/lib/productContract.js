'use strict';

const { Contract } = require('fabric-contract-api');

class ProductContract extends Contract {
    async initProductLedger(ctx) {
        console.log('initProductLedger');
        const assets = [
            {
                name: 'Product1',
                code: 'PR01',
                manufactororId: 'MSI',
                color: 'black',
                price: '100',
                cpu: 'r7',
                ram: '4gb',
                screen: 'FullHD',
                keyboard: 'No led',
                storage: '128GB',
                network: 'Wifi 6',
                usb: '3x 3.0',
                origin: 'USA',
                yearOrigin: '2019',
                type: 'laptop',
                owner: '',
                primaryImage: '',
                subImage: '',
            }
        ];

        for (let index = 0; index < assets.length; index++) {
            assets[index].docType = 'product';
            await ctx.stub.putState(assets[index].code, Buffer.from(JSON.stringify(assets[index])));
            console.log('add product ---------------------> ', assets[index].code);
        }
        console.log('initProductLedger done ============');
    }

    async queryProduct(ctx, productCode) {
        const productAsBytes = await ctx.stub.getState(productCode);
        if (!productAsBytes || productAsBytes.length === 0) {
            throw new Error(`${productCode} does not exist`);
        }
        return productAsBytes.toString();
    }

    async createProductLedger(ctx, name, code, manufactororId, color, price, cpu, ram,
        screen, keyboard, storage, network, usb, origin,
        yearOrigin, owner, primaryImage, subImage) {
        try {
            const product = {
                name: name,
                code: code,
                manufactororId: manufactororId,
                color: color ?? '',
                price: price ?? '',
                cpu: cpu ?? '',
                ram: ram ?? '',
                screen: screen ?? '',
                keyboard: keyboard ?? '',
                storage: storage ?? '',
                network: network ?? '',
                usb: usb ?? '',
                origin: origin ?? '',
                yearOrigin: yearOrigin ?? '',
                owner: owner ?? '',
                primaryImage: primaryImage ?? '',
                subImage: subImage ?? '',
                docType: 'product'
            }

            await ctx.stub.putState(code, Buffer.from(JSON.stringify(product)));
            return JSON.stringify(product);
        } catch (error) {
            throw new Error(error);
        }
    }

    async queryAllProducts(ctx) {
        const startKey = '';
        const endKey = '';
        const allProducts = [];
        for await (const { key, value } of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
                if (record.docType === 'product') {
                    allProducts.push({ Key: key, Value: record });
                }
            } catch (error) {
                console.log(error);
            }
        }
        console.log(allProducts);
        return JSON.stringify(allProducts);
    }

    async updateProductInformation(ctx, name, code, manufactororId, color, price, cpu, ram,
        screen, keyboard, storage, network, usb, origin,
        yearOrigin, owner, primaryImage, subImage) {
        console.info('============= START : updateProductInformation ===========');
        const productAsBytes = await ctx.stub.getState(code); // get the car from chaincode state
        if (!productAsBytes || productAsBytes.length === 0) {
            throw new Error(`${code} does not exist`);
        }
        const product = JSON.parse(productAsBytes.toString());
        if (product.docType !== 'product') {
            throw new Error(`${code} does not exist`);
        }
        product.name = name ?? product.name;
        product.code = code ?? product.code;
        product.manufactororId = manufactororId ?? product.manufactororId;
        product.color = color ?? product.color;
        product.price = price ?? product.price;
        product.cpu = cpu ?? product.cpu;
        product.ram = ram ?? product.ram;
        product.screen = screen ?? product.screen;
        product.keyboard = keyboard ?? product.keyboard;
        product.storage = storage ?? product.storage;
        product.network = network ?? product.network;
        product.usb = usb ?? product.usb;
        product.origin = origin ?? product.origin;
        product.yearOrigin = yearOrigin ?? product.yearOrigin;
        product.owner = owner ?? product.owner;
        product.primaryImage = primaryImage ?? product.primaryImage;
        product.subImage = subImage ?? product.subImage;

        await ctx.stub.putState(code, Buffer.from(JSON.stringify(product)));
        console.info('============= END : updateProductInformation ===========');
        return JSON.stringify(product);
    }

    async changeProductOwner(ctx, productCode, newOwner) {
        console.info('============= START : changeProductOwner ===========');
        const productAsBytes = await ctx.stub.getState(productCode); // get the car from chaincode state
        if (!productAsBytes || productAsBytes.length === 0) {
            throw new Error(`${productCode} does not exist`);
        }
        const product = JSON.parse(productAsBytes.toString());
        if (product.docType !== 'product') {
            throw new Error(`${productCode} does not exist`);
        }
        product.owner = newOwner;

        await ctx.stub.putState(productCode, Buffer.from(JSON.stringify(product)));
        console.info('============= END : changeProductOwner ===========');
        return JSON.stringify(product);
    }

    async getOwnerProducts(ctx, ownerId) {
        console.info('============= START : getOwnerProducts ===========');
        const startKey = '';
        const endKey = '';
        const allProducts = [];
        for await (const { key, value } of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
                if (record.docType === 'product' && record.owner === ownerId) {
                    allProducts.push({ Key: key, Value: record });
                }
            } catch (error) {
                console.log(error);
            }
        }
        console.log(allProducts);
        return JSON.stringify(allProducts);
    }

    async deleteProduct(ctx, productCode) {
        console.info('============= START : changeProductOwner ===========');
        const productAsBytes = await ctx.stub.getState(productCode); // get the car from chaincode state
        if (!productAsBytes || productAsBytes.length === 0) {
            throw new Error(`${productCode} does not exist`);
        }
        const product = JSON.parse(productAsBytes.toString());
        if (product.docType !== 'product') {
            throw new Error(`${productCode} does not exist`);
        }

        await ctx.stub.deleteState(productCode);
        console.info('============= END : changeProductOwner ===========');
    }

    async getTransactionById(ctx, txId) {
        return await ctx.stub.GetTxID(txId);
    }

    /**
      * getCurrentUserId
      * To be called by application to get the type for a user who is logged in
      *
      * @param {Context} ctx the transaction context
      * Usage:  getCurrentUserId ()
     */
    async getCurrentUserId(ctx) {

        let id = [];
        id.push(ctx.clientIdentity.getID());
        var begin = id[0].indexOf("/CN=");
        var end = id[0].lastIndexOf("::/C=");
        let userid = id[0].substring(begin + 4, end);
        return userid;
    }

    /**
      * getCurrentUserType
      * To be called by application to get the type for a user who is logged in
      *
      * @param {Context} ctx the transaction context
      * Usage:  getCurrentUserType ()
     */
    async getCurrentUserType(ctx) {

        let userid = await this.getCurrentUserId(ctx);

        //  check user id;  if admin, return type = admin;
        //  else return value set for attribute "type" in certificate;
        if (userid == "admin") {
            return userid;
        }
        return ctx.clientIdentity.getAttributeValue("usertype");
    }

    static toBuffer(data) {
        return Buffer.from(JSON.stringify(data));
    }

    static fromBuffer(buffer) {
        return Order.deserialize(Buffer.from(JSON.parse(buffer)));
    }
}

module.exports = ProductContract;