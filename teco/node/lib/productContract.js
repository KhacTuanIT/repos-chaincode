'use strict';

const { Contract } = require('fabric-contract-api');

class ProductContract extends Contract {
    async initProductLedger(ctx) {
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
        }
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
                color: color ? color : '',
                price: price ? price : '',
                cpu: cpu ? cpu : '',
                ram: ram ? ram : '',
                screen: screen ? screen : '',
                keyboard: keyboard ? keyboard : '',
                storage: storage ? storage : '',
                network: network ? network : '',
                usb: usb ? usb : '',
                origin: origin ? origin : '',
                yearOrigin: yearOrigin ? yearOrigin : '',
                owner: owner ? owner : '',
                primaryImage: primaryImage ? primaryImage : '',
                subImage: subImage ? subImage : '',
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
                throw new Error(error);
            }
        }
        return JSON.stringify(allProducts);
    }

    async updateProductInformation(ctx, name, code, manufactororId, color, price, cpu, ram,
        screen, keyboard, storage, network, usb, origin,
        yearOrigin, owner, primaryImage, subImage) {
        const productAsBytes = await ctx.stub.getState(code); // get the car from chaincode state
        if (!productAsBytes || productAsBytes.length === 0) {
            throw new Error(`${code} does not exist`);
        }
        const product = JSON.parse(productAsBytes.toString());
        if (product.docType !== 'product') {
            throw new Error(`${code} does not exist`);
        }
        product.name = name ? name : product.name;
        product.code = code ? code : product.code;
        product.manufactororId = manufactororId ? manufactororId : product.manufactororId;
        product.color = color ? color : product.color;
        product.price = price ? price : product.price;
        product.cpu = cpu ? cpu : product.cpu;
        product.ram = ram ? ram : product.ram;
        product.screen = screen ? screen : product.screen;
        product.keyboard = keyboard ? keyboard : product.keyboard;
        product.storage = storage ? storage : product.storage;
        product.network = network ? network : product.network;
        product.usb = usb ? usb : product.usb;
        product.origin = origin ? origin : product.origin;
        product.yearOrigin = yearOrigin ? yearOrigin : product.yearOrigin;
        product.owner = owner ? owner : product.owner;
        product.primaryImage = primaryImage ? primaryImage : product.primaryImage;
        product.subImage = subImage ? subImage : product.subImage;

        await ctx.stub.putState(code, Buffer.from(JSON.stringify(product)));
        return JSON.stringify(product);
    }

    async changeProductOwner(ctx, productCode, newOwner) {
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
        return JSON.stringify(product);
    }

    async getOwnerProducts(ctx, ownerId) {
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
                throw new Error(error);
            }
        }
        return JSON.stringify(allProducts);
    }

    async deleteProduct(ctx, productCode) {
        const productAsBytes = await ctx.stub.getState(productCode); // get the car from chaincode state
        if (!productAsBytes || productAsBytes.length === 0) {
            throw new Error(`${productCode} does not exist`);
        }
        const product = JSON.parse(productAsBytes.toString());
        if (product.docType !== 'product') {
            throw new Error(`${productCode} does not exist`);
        }

        await ctx.stub.deleteState(productCode);
    }
}

module.exports = ProductContract;