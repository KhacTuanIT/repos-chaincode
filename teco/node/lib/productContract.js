"use strict";

const { Contract } = require("fabric-contract-api");

class ProductContract extends Contract {
  async initProductLedger(ctx) {
    const assets = [
      {
        name: "MacBook Air (M1, 2020)",
        code: "LAP0000001",
        manufactororId: "MAN0000001",
        color: "Black",
        price: "899",
        cpu: "M1",
        ram: "8GB Unified RAM",
        screen: '13.3"',
        keyboard: "No led",
        storage: "256GB",
        network: "Wifi 6",
        usb: "Two Thunderbolt / USB 4 ports",
        origin: "USA",
        yearOrigin: "2021",
        type: "PRT0000001",
        vga: "",
        description: "",
        owner: "",
        primaryImage: "",
        subImage: "",
        is_delete: false,
        updated_by: "",
      },
      {
        name: "Apple MacBook Air with Apple M1",
        code: "LAP0000002",
        manufactororId: "MAN0000001",
        color: "Rose",
        price: "899",
        cpu: "M1",
        ram: "8GB Unified RAM",
        screen: '13.3"',
        keyboard: "No led",
        storage: "256GB",
        network: "Wifi 6",
        usb: "2x type C",
        origin: "USA",
        yearOrigin: "2021",
        type: "PRT0000001",
        vga: "",
        description: "",
        owner: "",
        primaryImage: "",
        subImage: "",
        is_delete: false,
        updated_by: "",
      },
      {
        name: "Dell XPS 13",
        code: "LAP0000003",
        manufactororId: "MAN0000005",
        color: "Black",
        price: "649",
        cpu: "Intel I5 11370",
        ram: "8GB RAM",
        screen: '15.6"',
        keyboard: "No led",
        storage: "256GB",
        network: "Wifi 6",
        usb: "3x 3.0",
        origin: "USA",
        yearOrigin: "2021",
        type: "PRT0000001",
        vga: "Intel® Iris® Xe Graphics",
        description: "",
        owner: "",
        primaryImage: "",
        subImage: "",
        is_delete: false,
        updated_by: "",
      },
      {
        name: "Dell XPS 13 2-in-1",
        code: "LAP0000004",
        manufactororId: "MAN0000005",
        color: "Black",
        price: "969",
        cpu: "Intel I5 11370",
        ram: "8GB RAM",
        screen: '13.3"',
        keyboard: "No led",
        storage: "256GB",
        network: "Wifi 6",
        usb: "3x 3.0",
        origin: "USA",
        yearOrigin: "2021",
        type: "PRT0000001",
        vga: "Intel® Iris® Xe Graphics",
        description: "",
        owner: "",
        primaryImage: "",
        subImage: "",
        is_delete: false,
        updated_by: "",
      },
      {
        name: "Dell XPS 13 2-in-1",
        code: "LAP0000005",
        manufactororId: "MAN0000005",
        color: "Black",
        price: "1219",
        cpu: "Intel I5 11520",
        ram: "16GB RAM",
        screen: '15.6"',
        keyboard: "No led",
        storage: "512GB",
        network: "Wifi 6",
        usb: "3x 3.0",
        origin: "USA",
        yearOrigin: "2021",
        type: "PRT0000001",
        vga: "Intel® Iris® Xe Graphics",
        description: "",
        owner: "",
        primaryImage: "",
        subImage: "",
        is_delete: false,
        updated_by: "",
      },
      {
        name: "Asus ROG Mothership",
        code: "LAP0000006",
        manufactororId: "MAN0000004",
        color: "Black",
        price: "899",
        cpu: "Intel Core i9-9980HK",
        ram: "32GB RAM",
        screen: '15.6"',
        keyboard: "RGB",
        storage: "512GB",
        network: "Wifi 6",
        usb: "3x 3.0",
        origin: "USA",
        yearOrigin: "2021",
        type: "PRT0000001",
        vga: "NVIDIA® GeForce RTX™ 2080 8GB GDDR6",
        description: "",
        owner: "",
        primaryImage: "",
        subImage: "",
        is_delete: false,
        updated_by: "",
      },
      {
        name: "Alienware Area-51m",
        code: "LAP0000007",
        manufactororId: "MAN0000008",
        color: "Black",
        price: "1599",
        cpu: "Intel Core i9-9900K",
        ram: "64GB RAM",
        screen: '15.6"',
        keyboard: "RGB",
        storage: "1TB",
        network: "Wifi 6",
        usb: "3x 3.0",
        origin: "USA",
        yearOrigin: "2021",
        type: "PRT0000001",
        vga: "NVIDIA® GeForce RTX™ 2060",
        description: "",
        owner: "",
        primaryImage: "",
        subImage: "",
        is_delete: false,
        updated_by: "",
      },
      {
        name: "MSI GT76 Titan",
        code: "LAP0000008",
        manufactororId: "MAN0000003",
        color: "Black",
        price: "2999",
        cpu: "Intel Core i9-9900K",
        ram: "64GB RAM",
        screen: '15.6"',
        keyboard: "RGB",
        storage: "1TB",
        network: "Wifi 6",
        usb: "3x 3.0",
        origin: "USA",
        yearOrigin: "2021",
        type: "PRT0000001",
        vga: "NVIDIA GeForce RTX 2080 8GB GDDR6",
        description: "",
        owner: "",
        primaryImage: "",
        subImage: "",
        is_delete: false,
        updated_by: "",
      },
      {
        name: "Asus ZenBook Pro Duo",
        code: "LAP0000009",
        manufactororId: "MAN0000001",
        color: "Black",
        price: "2999",
        cpu: "Intel Core i9-9980HK",
        ram: "32GB RAM",
        screen: '15.6"',
        keyboard: "No led",
        storage: "1TB",
        network: "Wifi 6",
        usb: "3x 3.0",
        origin: "USA",
        yearOrigin: "2021",
        type: "PRT0000001",
        vga: "GeForce RTX™2060",
        description: "",
        owner: "",
        primaryImage: "",
        subImage: "",
        is_delete: false,
        updated_by: "",
      },
      {
        name: "Dell Precision 7730",
        code: "LAP0000010",
        manufactororId: "MAN0000005",
        color: "Black",
        price: "1599",
        cpu: "MIntel Core i9-9980HK1",
        ram: "32GB RAM",
        screen: '15.6"',
        keyboard: "RGB",
        storage: "256GB",
        network: "Wifi 6",
        usb: "3x 3.0",
        origin: "USA",
        yearOrigin: "2021",
        type: "PRT0000001",
        vga: "Nvidia Quadro P3200 6GB",
        description: "",
        owner: "",
        primaryImage: "",
        subImage: "",
        is_delete: false,
        updated_by: "",
      },
      {
        name: "HP ZBook 17 G4",
        code: "LAP0000011",
        manufactororId: "MAN0000006",
        color: "Black",
        price: "1529",
        cpu: "Intel Core i7-7700HQ",
        ram: "64GB RAM",
        screen: '17"',
        keyboard: "RGB",
        storage: "512GB",
        network: "Wifi 6",
        usb: "3x 3.0",
        origin: "USA",
        yearOrigin: "2021",
        type: "PRT0000001",
        vga: "NVIDIA Quadro M1200",
        description: "",
        owner: "",
        primaryImage: "",
        subImage: "",
        is_delete: false,
        updated_by: "",
      },
      {
        name: "Acer Helios 300",
        code: "LAP0000012",
        manufactororId: "MAN0000001",
        color: "Black",
        price: "899",
        cpu: "Intel Core i7-11700HQ",
        ram: "32GB 3200 MHz",
        screen: '15.6"',
        keyboard: "RGB",
        storage: "1TB",
        network: "Wifi 6",
        usb: "3x 3.0",
        origin: "USA",
        yearOrigin: "2021",
        type: "PRT0000001",
        vga: "NVIDIA® GeForce RTX ™ 3080",
        description: "",
        owner: "",
        primaryImage: "",
        subImage: "",
        is_delete: false,
        updated_by: "",
      },
      {
        name: "Dell XPS Desktop 8940 Special Edition",
        code: "DES0000001",
        manufactororId: "MAN0000005",
        color: "Black",
        price: "899",
        cpu: "Intel Core i9-11700HQ",
        ram: "64GB 3200 MHz",
        screen: '15.6"',
        keyboard: "",
        storage: "1TB",
        network: "Wifi 6",
        usb: "3x 3.0",
        origin: "USA",
        yearOrigin: "2021",
        type: "PRT0000002",
        vga: "Nvidia GeForce RTX 3070",
        description: "",
        owner: "",
        primaryImage: "",
        subImage: "",
        is_delete: false,
        updated_by: "",
      },
      {
        name: "Mac Mini M1 (2020)",
        code: "DES0000002",
        manufactororId: "MAN0000002",
        color: "Black",
        price: "699",
        cpu: "Intel Core i9-11700HQ",
        ram: "64GB 3200 MHz",
        screen: '15.6"',
        keyboard: "",
        storage: "1TB",
        network: "Wifi 6",
        usb: "3x 3.0",
        origin: "USA",
        yearOrigin: "2021",
        type: "PRT0000002",
        vga: "Nvidia GeForce RTX 3070",
        description: "",
        owner: "",
        primaryImage: "",
        subImage: "",
        is_delete: false,
        updated_by: "",
      },
      {
        name: "HP Envy 32",
        code: "DES0000003",
        manufactororId: "MAN0000006",
        color: "Black",
        price: "2528",
        cpu: "Intel Core i9-11700HQ",
        ram: "64GB 3200 MHz",
        screen: '32" 4K',
        keyboard: "",
        storage: "256GB SSD",
        network: "Wifi 6",
        usb: "3x 3.0",
        origin: "USA",
        yearOrigin: "2021",
        type: "PRT0000002",
        vga: "Nvidia GTX 1650",
        description: "",
        owner: "",
        primaryImage: "",
        subImage: "",
        is_delete: false,
        updated_by: "",
      },
      {
        name: "Surface Studio 2",
        code: "DES0000004",
        manufactororId: "MAN0000007",
        color: "Black",
        price: "3739",
        cpu: "Intel Core i5",
        ram: "16GB 3200 MHz",
        screen: '28" 4K',
        keyboard: "",
        storage: "512GB SSD",
        network: "Wifi 6",
        usb: "USB 3.1 / 3.2",
        origin: "USA",
        yearOrigin: "2021",
        type: "PRT0000002",
        vga: "Nvidia GTX 1650",
        description: "",
        owner: "",
        primaryImage: "",
        subImage: "",
        is_delete: false,
        updated_by: "",
      },
    ];

    for (let index = 0; index < assets.length; index++) {
      assets[index].docType = "product";
      await ctx.stub.putState(
        assets[index].code,
        Buffer.from(JSON.stringify(assets[index]))
      );
    }
  }

  async queryProduct(ctx, productCode) {
    const productAsBytes = await ctx.stub.getState(productCode);
    if (!productAsBytes || productAsBytes.length === 0) {
      throw new Error(`${productCode} does not exist`);
    }
    return productAsBytes.toString();
  }

  async createProductLedger(
    ctx,
    name,
    code,
    manufactororId,
    color,
    price,
    cpu,
    ram,
    screen,
    keyboard,
    storage,
    network,
    usb,
    origin,
    yearOrigin,
    owner,
    primaryImage,
    subImage,
    description,
    updated_by
  ) {
    try {
      const product = {
        name: name,
        code: code,
        manufactororId: manufactororId,
        color: color ? color : "",
        price: price ? price : "",
        cpu: cpu ? cpu : "",
        ram: ram ? ram : "",
        screen: screen ? screen : "",
        keyboard: keyboard ? keyboard : "",
        storage: storage ? storage : "",
        network: network ? network : "",
        usb: usb ? usb : "",
        origin: origin ? origin : "",
        yearOrigin: yearOrigin ? yearOrigin : "",
        owner: owner ? owner : "",
        primaryImage: primaryImage ? primaryImage : "",
        subImage: subImage ? subImage : "",
        description: description ? description : "",
        docType: "product",
        is_delete: false,
        updated_by: updated_by ? updated_by : "",
      };

      await ctx.stub.putState(code, Buffer.from(JSON.stringify(product)));
      return JSON.stringify(product);
    } catch (error) {
      throw new Error(error);
    }
  }

  async queryAllProducts(ctx) {
    const startKey = "";
    const endKey = "";
    const allProducts = [];
    for await (const { key, value } of ctx.stub.getStateByRange(
      startKey,
      endKey
    )) {
      const strValue = Buffer.from(value).toString("utf8");
      let record;
      try {
        record = JSON.parse(strValue);
        if (record.docType === "product") {
          allProducts.push({ Key: key, Value: record });
        }
      } catch (error) {
        throw new Error(error);
      }
    }
    return JSON.stringify(allProducts);
  }

  async updateProductInformation(
    ctx,
    name,
    code,
    manufactororId,
    color,
    price,
    cpu,
    ram,
    screen,
    keyboard,
    storage,
    network,
    usb,
    origin,
    yearOrigin,
    owner,
    primaryImage,
    subImage,
    description,
    updated_by
  ) {
    try {
      const productAsBytes = await ctx.stub.getState(code); // get the car from chaincode state
      if (!productAsBytes || productAsBytes.length === 0) {
        throw new Error(`${code} does not exist`);
      }
      const product = JSON.parse(productAsBytes.toString());
      if (product.docType !== "product") {
        throw new Error(`${code} does not exist`);
      }
      product.name = name ? name : product.name;
      product.code = code ? code : product.code;
      product.manufactororId = manufactororId
        ? manufactororId
        : product.manufactororId;
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
      product.updated_by = updated_by ? updated_by : product.updated_by;

      await ctx.stub.putState(code, Buffer.from(JSON.stringify(product)));
      return JSON.stringify(product);
    } catch (error) {
      throw new Error(error);
    }
  }

  async changeProductOwner(ctx, productCode, newOwner, updated_by) {
    const productAsBytes = await ctx.stub.getState(productCode); // get the car from chaincode state
    if (!productAsBytes || productAsBytes.length === 0) {
      throw new Error(`${productCode} does not exist`);
    }
    const product = JSON.parse(productAsBytes.toString());
    if (product.docType !== "product") {
      throw new Error(`${productCode} does not exist`);
    }
    product.owner = newOwner;
    product.updated_by = updated_by;

    await ctx.stub.putState(productCode, Buffer.from(JSON.stringify(product)));
    return JSON.stringify(product);
  }

  async getOwnerProducts(ctx, ownerId) {
    const startKey = "";
    const endKey = "";
    const allProducts = [];
    for await (const { key, value } of ctx.stub.getStateByRange(
      startKey,
      endKey
    )) {
      const strValue = Buffer.from(value).toString("utf8");
      let record;
      try {
        record = JSON.parse(strValue);
        if (record.docType === "product" && record.owner === ownerId) {
          allProducts.push({ Key: key, Value: record });
        }
      } catch (error) {
        throw new Error(error);
      }
    }
    return JSON.stringify(allProducts);
  }

  async deleteProduct(ctx, productCode, updated_by) {
    const productAsBytes = await ctx.stub.getState(productCode); // get the car from chaincode state
    if (!productAsBytes || productAsBytes.length === 0) {
      throw new Error(`${productCode} does not exist`);
    }
    let product = JSON.parse(productAsBytes.toString());
    if (product.docType !== "product") {
      throw new Error(`${productCode} does not exist`);
    }
    product.is_delete = true;
    product.updated_by = updated_by;

    await ctx.stub.putState(productCode, Buffer.from(JSON.stringify(product)));
  }

  async getProductHistory(ctx, productId) {
    if (productId.length < 1) {
      throw new Error("productId is required as input");
    }

    var orderAsBytes = await ctx.stub.getState(productId);

    if (!orderAsBytes || orderAsBytes.length === 0) {
      throw new Error(
        `Error Message from getProductHistory: Order with productId = ${productId} does not exist.`
      );
    }

    const iterator = await ctx.stub.getHistoryForKey(productId);
    const productHistory = [];

    while (true) {
      let history = await iterator.next();

      if (history.value && history.value.value.toString()) {
        let jsonRes = {};
        jsonRes.TxId = history.value.txId;
        jsonRes.IsDelete = history.value.is_delete
          ? history.value.is_delete.toString()
          : "false";

        var d = new Date(0);
        d.setUTCSeconds(history.value.timestamp.seconds.low);
        jsonRes.Timestamp =
          d.toLocaleString("en-US", { timeZone: "America/Chicago" }) + " CST";

        try {
          jsonRes.Value = JSON.parse(history.value.value.toString("utf8"));
        } catch (err) {
          console.log(err);
          jsonRes.Value = history.value.value.toString("utf8");
        }

        productHistory.push(jsonRes);
      }

      if (history.done) {
        await iterator.close();
        return JSON.stringify(productHistory);
      }
    }
  }
}

module.exports = ProductContract;
