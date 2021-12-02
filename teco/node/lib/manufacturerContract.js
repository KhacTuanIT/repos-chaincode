"use strict";

const { Contract } = require("fabric-contract-api");

class ManufacturerContract extends Contract {
  async initManufacturer(ctx) {
    const assets = [
      {
        manufactororId: "MAN0000001",
        name: "Macbook",
      },
      {
        manufactororId: "MAN0000002",
        name: "Acer",
      },
      {
        manufactororId: "MAN0000003",
        name: "MSI",
      },
      {
        manufactororId: "MAN0000004",
        name: "ASUS",
      },
      {
        manufactororId: "MAN0000005",
        name: "Dell",
      },
      {
        manufactororId: "MAN0000006",
        name: "HP",
      },
      {
        manufactororId: "MAN0000007",
        name: "Windows",
      },
      {
        manufactororId: "MAN0000008",
        name: "Alienware",
      },
    ];
    for (let i = 0; i < assets.length; i++) {
      assets[i].docType = "manufacturer";
      await ctx.stub.putState(
        assets[i].manufactororId,
        Buffer.from(JSON.stringify(assets[i]))
      );
    }
    return;
  }

  async createManufacturer(ctx, manufactororId, name) {
    const manufacturer = {
      manufactororId: manufactororId,
      name: name,
      docType: "manufacturer",
    };

    try {
      await ctx.stub.putState(
        manufactororId,
        Buffer.from(JSON.stringify(manufacturer))
      );
      return JSON.stringify(manufacturer);
    } catch (error) {
      throw new Error(error);
    }
  }

  async queryManufacturer(ctx, manufactororId) {
    const manufacturerAsBytes = await ctx.stub.getState(manufactororId);
    if (!manufacturerAsBytes || manufacturerAsBytes.length === 0) {
      throw new Error(`${manufactororId} does not exist`);
    }
    return manufacturerAsBytes.toString();
  }

  async queryAllManufactureres(ctx) {
    const startKey = "";
    const endKey = "";
    const allManufactureres = [];
    for await (const { key, value } of ctx.stub.getStateByRange(
      startKey,
      endKey
    )) {
      const strValue = Buffer.from(value).toString("utf8");
      let record;
      try {
        record = JSON.parse(strValue);
        if (record.docType === "manufacturer") {
          allManufactureres.push({ Key: key, Value: record });
        }
      } catch (error) {
        throw new Error(error);
      }
    }
    return JSON.stringify(allManufactureres);
  }

  async updateManufacturer(ctx, manufactororId, name) {
    const manufacturerAsBytes = await ctx.stub.getState(manufactororId);
    if (!manufacturerAsBytes || manufacturerAsBytes.length === 0) {
      throw new Error(`${manufactororId} does not exist`);
    }

    const manufacturer = JSON.parse(manufacturerAsBytes.toString());
    manufacturer.name = name;

    try {
      await ctx.stub.putState(
        manufactororId,
        Buffer.from(JSON.stringify(manufacturer))
      );
      return JSON.stringify(manufacturer);
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteManufacturer(ctx, manufactororId) {
    const manufacturerAsBytes = await ctx.stub.getState(manufactororId);
    if (!manufacturerAsBytes || manufacturerAsBytes.length === 0) {
      throw new Error(`${manufactororId} does not exist`);
    }
    try {
      await ctx.stub.deleteState(manufactororId);
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getManufacturerHistory(ctx, manufactororId) {
    if (manufactororId.length < 1) {
      throw new Error("manufactororId is required as input");
    }

    var orderAsBytes = await ctx.stub.getState(manufactororId);

    if (!orderAsBytes || orderAsBytes.length === 0) {
      throw new Error(
        `Error Message from getManufacturerHistory: Order with manufactororId = ${manufactororId} does not exist.`
      );
    }

    const iterator = await ctx.stub.getHistoryForKey(manufactororId);
    const manufacturerHistory = [];

    while (true) {
      let history = await iterator.next();

      if (history.value && history.value.value.toString()) {
        let jsonRes = {};
        jsonRes.TxId = history.value.tx_id;
        jsonRes.IsDelete = history.value.is_delete.toString();

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

        manufacturerHistory.push(jsonRes);
      }

      if (history.done) {
        await iterator.close();
        return JSON.stringify(manufacturerHistory);
      }
    }
  }
}

module.exports = ManufacturerContract;
