"use strict";

const { Contract } = require("fabric-contract-api");

class ProductTypeContract extends Contract {
  async initProductType(ctx) {
    const assets = [
      {
        productTypeId: "PRT0000001",
        name: "Laptop",
      },
      {
        productTypeId: "PRT0000002",
        name: "Desktop",
      },
      {
        productTypeId: "PRT0000003",
        name: "Notebook",
      },
    ];
    for (let i = 0; i < assets.length; i++) {
      assets[i].docType = "product-type";
      await ctx.stub.putState(
        assets[i].manufactororId,
        Buffer.from(JSON.stringify(assets[i]))
      );
    }
    return;
  }

  async createProductType(ctx, productTypeId, name) {
    const productType = {
      productTypeId: productTypeId,
      name: name,
      docType: "product-type",
    };

    try {
      await ctx.stub.putState(
        productTypeId,
        Buffer.from(JSON.stringify(productType))
      );
      return JSON.stringify(productType);
    } catch (error) {
      throw new Error(error);
    }
  }

  async queryProductType(ctx, productTypeId) {
    const productTypeAsBytes = await ctx.stub.getState(productTypeId);
    if (!productTypeAsBytes || productTypeAsBytes.length === 0) {
      throw new Error(`Product type ${productTypeId} does not exist`);
    }

    try {
      return productTypeAsBytes.toString();
    } catch (error) {
      throw new Error(error);
    }
  }

  async queryAllProductTypes(ctx) {
    const startKey = "";
    const endKey = "";
    const allProductTypes = [];
    for await (const { key, value } of ctx.stub.getStateByRange(
      startKey,
      endKey
    )) {
      const strValue = Buffer.from(value).toString("utf8");
      let record;
      try {
        record = JSON.parse(strValue);
        if (record.docType === "product-type") {
          allProductTypes.push({ Key: key, Value: record });
        }
      } catch (error) {
        throw new Error(error);
      }
    }
    return JSON.stringify(allProductTypes);
  }

  async updateProductType(ctx, productTypeId, name) {
    const productTypeAsBytes = await ctx.stub.getState(productTypeId);
    if (!productTypeAsBytes || productTypeAsBytes.length === 0) {
      throw new Error(`Product type ${productTypeId} does not exist`);
    }

    const productType = JSON.parse(productTypeAsBytes.toString());

    productType.name = name;

    try {
      await ctx.stub.putState(
        productTypeId,
        Buffer.from(JSON.stringify(productType))
      );
      return JSON.stringify(productType);
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteProductType(ctx, productTypeId) {
    const productTypeAsBytes = await ctx.stub.getState(productTypeId);
    if (!productTypeAsBytes || productTypeAsBytes.length === 0) {
      throw new Error(`Product type ${productTypeId} does not exist`);
    }

    try {
      await ctx.stub.deleteState(productTypeId);
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = ProductTypeContract;
