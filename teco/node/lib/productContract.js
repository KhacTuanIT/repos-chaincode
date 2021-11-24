'use strict';

const { Contract } = require('fabric-contract-api');

class ProductContract extends Contract {
    async initProductLedger(ctx) {
        const assets = [
            {
                name: 'MacBook Air (M1, 2020)',
                code: 'LAP0000001',
                manufactororId: 'MAN0000001',
                color: 'Black',
                price: '899',
                cpu: 'M1',
                ram: '8GB Unified RAM',
                screen: '13.3"',
                keyboard: 'No led',
                storage: '256GB',
                network: 'Wifi 6',
                usb: '3x 3.0',
                origin: 'USA',
                yearOrigin: '2021',
                type: 'PRT0000001',
                description: '',
                owner: '',
                primaryImage: '',
                subImage: '',
            },
            {
                name: 'Apple MacBook Air with Apple M1',
                code: 'LAP0000002',
                manufactororId: 'MAN0000001',
                color: 'Rose',
                price: '899',
                cpu: 'M1',
                ram: '8GB Unified RAM',
                screen: '13.3"',
                keyboard: 'No led',
                storage: '256GB',
                network: 'Wifi 6',
                usb: '2x type C',
                origin: 'USA',
                yearOrigin: '2021',
                type: 'PRT0000001',
                description: '',
                owner: '',
                primaryImage: '',
                subImage: '',
            },
            {
                name: 'Dell XPS 13',
                code: 'LAP0000003',
                manufactororId: 'MAN0000005',
                color: 'Black',
                price: '649',
                cpu: 'Intel I5 11370',
                ram: '8GB RAM',
                screen: '15.6"',
                keyboard: 'No led',
                storage: '256GB',
                network: 'Wifi 6',
                usb: '3x 3.0',
                origin: 'USA',
                yearOrigin: '2021',
                type: 'PRT0000001',
                description: '',
                owner: '',
                primaryImage: '',
                subImage: '',
            },
            {
                name: 'Dell XPS 13 2-in-1',
                code: 'LAP0000004',
                manufactororId: 'MAN0000005',
                color: 'Black',
                price: '969',
                cpu: 'Intel I5 11370',
                ram: '8GB RAM',
                screen: '13.3"',
                keyboard: 'No led',
                storage: '256GB',
                network: 'Wifi 6',
                usb: '3x 3.0',
                origin: 'USA',
                yearOrigin: '2021',
                type: 'PRT0000001',
                description: '',
                owner: '',
                primaryImage: '',
                subImage: '',
            },
            {
                name: 'Dell XPS 13 2-in-1',
                code: 'LAP0000005',
                manufactororId: 'MAN0000005',
                color: 'Black',
                price: '1219',
                cpu: 'Intel I5 11520',
                ram: '16GB RAM',
                screen: '15.6"',
                keyboard: 'No led',
                storage: '512GB',
                network: 'Wifi 6',
                usb: '3x 3.0',
                origin: 'USA',
                yearOrigin: '2021',
                type: 'PRT0000001',
                description: '',
                owner: '',
                primaryImage: '',
                subImage: '',
            },
            {
                name: 'Asus ROG Mothership',
                code: 'LAP0000006',
                manufactororId: 'MAN0000004',
                color: 'Black',
                price: '899',
                cpu: 'Intel Core i9-9980HK',
                ram: '32GB RAM',
                screen: '15.6"',
                keyboard: 'RGB',
                storage: '512GB',
                network: 'Wifi 6',
                usb: '3x 3.0',
                origin: 'USA',
                yearOrigin: '2021',
                type: 'PRT0000001',
                description: '',
                owner: '',
                primaryImage: '',
                subImage: '',
            },
            {
                name: 'Alienware Area-51m',
                code: 'LAP0000007',
                manufactororId: 'MAN0000003',
                color: 'Black',
                price: '1599',
                cpu: 'Intel Core i9-9900K',
                ram: '64GB RAM',
                screen: '15.6"',
                keyboard: 'RGB',
                storage: '1TB',
                network: 'Wifi 6',
                usb: '3x 3.0',
                origin: 'USA',
                yearOrigin: '2021',
                type: 'PRT0000001',
                description: '',
                owner: '',
                primaryImage: '',
                subImage: '',
            },
            {
                name: 'MSI GT76 Titan',
                code: 'LAP0000008',
                manufactororId: 'MAN0000003',
                color: 'Black',
                price: '2999',
                cpu: 'Intel Core i9-9900K',
                ram: '64GB RAM',
                screen: '15.6"',
                keyboard: 'RGB',
                storage: '1TB',
                network: 'Wifi 6',
                usb: '3x 3.0',
                origin: 'USA',
                yearOrigin: '2021',
                type: 'PRT0000001',
                description: '',
                owner: '',
                primaryImage: '',
                subImage: '',
            },
            {
                name: 'Asus ZenBook Pro Duo',
                code: 'LAP0000009',
                manufactororId: 'MAN0000001',
                color: 'Black',
                price: '2999',
                cpu: 'Intel Core i9-9980HK',
                ram: '32GB RAM',
                screen: '15.6"',
                keyboard: 'No led',
                storage: '1TB',
                network: 'Wifi 6',
                usb: '3x 3.0',
                origin: 'USA',
                yearOrigin: '2021',
                type: 'PRT0000001',
                description: '',
                owner: '',
                primaryImage: '',
                subImage: '',
            },
            {
                name: 'Dell Precision 7730',
                code: 'LAP0000010',
                manufactororId: 'MAN0000005',
                color: 'Black',
                price: '1599',
                cpu: 'MIntel Core i9-9980HK1',
                ram: '32GB RAM',
                screen: '15.6"',
                keyboard: 'RGB',
                storage: '256GB',
                network: 'Wifi 6',
                usb: '3x 3.0',
                origin: 'USA',
                yearOrigin: '2021',
                type: 'PRT0000001',
                description: '',
                owner: '',
                primaryImage: '',
                subImage: '',
            },
            {
                name: 'HP ZBook 17 G4',
                code: 'LAP0000011',
                manufactororId: 'MAN0000006',
                color: 'Black',
                price: '1529',
                cpu: 'Intel Core i7-7700HQ',
                ram: '64GB RAM',
                screen: '17"',
                keyboard: 'RGB',
                storage: '512GB',
                network: 'Wifi 6',
                usb: '3x 3.0',
                origin: 'USA',
                yearOrigin: '2021',
                type: 'PRT0000001',
                description: '',
                owner: '',
                primaryImage: '',
                subImage: '',
            },
            {
                name: 'Acer Helios 300',
                code: 'LAP0000001',
                manufactororId: 'MAN0000001',
                color: 'Black',
                price: '899',
                cpu: 'Intel Core i7-11700HQ',
                ram: '32GB 3200 MHz',
                screen: '15.6"',
                keyboard: 'RGB',
                storage: '1TB',
                network: 'Wifi 6',
                usb: '3x 3.0',
                origin: 'USA',
                yearOrigin: '2021',
                type: 'PRT0000001',
                description: '',
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
        yearOrigin, owner, primaryImage, subImage, description) {
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
                description: description ? description : '',
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
        yearOrigin, owner, primaryImage, subImage, description) {
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
        product.description = description ? description : product.description;

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