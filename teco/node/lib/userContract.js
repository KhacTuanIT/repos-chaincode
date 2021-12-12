"use strict";
const { Contract, Context } = require("fabric-contract-api");

class UserContract extends Contract {
  async initUser(ctx) {
    console.log("init User");
    const userAssets = [
      {
        userId: "US0001",
        username: "adminsupply",
        firstName: "John",
        middleName: "",
        lastName: "Doe",
        password: this._hashCode("sample@123"),
        email: "admin.supply@example.com",
        address: "123 Duy Tan, VN",
        role: "admin",
        manager: "",
        org: "supply",
        docType: "user",
        is_delete: false,
        updated_by: "",
      },
      {
        userId: "US0002",
        username: "admindelivery",
        firstName: "John",
        middleName: "",
        lastName: "Doe",
        password: this._hashCode("sample@123"),
        email: "admin.delivery@example.com",
        address: "123 Duy Tan, VN",
        role: "admin",
        manager: "",
        org: "delivery",
        docType: "user",
        is_delete: false,
        updated_by: "",
      },
    ];
    for (let index = 0; index < userAssets.length; index++) {
      userAssets[index].docType = "user";
      await ctx.stub.putState(
        userAssets[index].userId,
        Buffer.from(JSON.stringify(userAssets[index]))
      );
      console.log(
        "add product ---------------------> ",
        userAssets[index].userId
      );
    }
    console.log("initProductLedger done ============");
  }

  async createUser(
    ctx,
    userId,
    username,
    firstName,
    middleName,
    lastName,
    password,
    email,
    address,
    role,
    manager,
    org,
    updated_by
  ) {
    const user = {
      userId: userId,
      username: username,
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      password: this._hashCode(password),
      email: email,
      address: address,
      role: role,
      manager: manager,
      org: org,
      docType: "user",
      is_delete: false,
      updated_by: updated_by ? updated_by : "",
    };
    try {
      await ctx.stub.putState(userId, Buffer.from(JSON.stringify(user)));
      return JSON.stringify(user);
    } catch (error) {
      throw new Error(error);
    }
  }

  async queryUser(ctx, userId) {
    const user = await ctx.stub.getState(userId);
    if (!user || user.length === 0)
      throw new Error(`User ${userId} doesn't exists in the system!`);
    return JSON.stringify(user);
  }

  async queryAllUserByManager(ctx, manager) {
    const startKey = "";
    const endKey = "";
    const allUsers = [];
    for await (const { key, value } of ctx.stub.getStateByRange(
      startKey,
      endKey
    )) {
      const strValue = Buffer.from(value).toString("utf8");
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

  async changePassword(ctx, userId, newPassword, updated_by) {
    const user = await ctx.stub.getState(userId);
    if (!user || user.length === 0)
      throw new Error(`User ${userId} doesn't exists in the system!`);
    if (user.password === this._hashCode(newPassword)) {
      throw new Error(
        `Password same with your old password, please try another password!`
      );
    }
    user = JSON.parse(user.toString());
    user.password = this._hashCode(newPassword);
    user.updated_by = updated_by;
    await ctx.stub.putState(userId, Buffer.from(JSON.stringify(user)));
    return JSON.stringify(user);
  }

  async changeUserInformation(
    ctx,
    userId,
    firstName,
    middleName,
    lastName,
    email,
    address,
    role,
    manager,
    org,
    updated_by
  ) {
    try {
      const user = await ctx.stub.getState(userId);
      if (!user || user.length === 0) {
        throw new Error(`User ${userId} doesn't exists in the system!`);
      }
      user = JSON.parse(user.toString());

      user.firstName = firstName ? firstName : user.firstName;
      user.middleName = middleName ? middleName : user.middleName;
      user.lastName = lastName ? lastName : user.lastName;
      user.email = email ? email : user.email;
      user.address = address ? address : user.address;
      user.role = role ? role : user.role;
      user.manager = manager ? manager : user.manager;
      user.org = org ? org : user.org;
      user.updated_by = updated_by ? updated_by : user.updated_by;

      await ctx.stub.putState(userId, Buffer.from(JSON.stringify(user)));
      return JSON.stringify(user);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUserByUsername(ctx, username) {
    const startKey = "";
    const endKey = "";
    let expectedUser = undefined;
    for await (const { key, value } of ctx.stub.getStateByRange(
      startKey,
      endKey
    )) {
      const strValue = Buffer.from(value).toString("utf8");
      let record;
      try {
        record = JSON.parse(strValue);
        if (record.username === username) {
          expectedUser = record;
        }
      } catch (error) {
        throw new Error(error);
      }
    }
    if (expectedUser) {
      return JSON.stringify(expectedUser);
    }
    return JSON.stringify({ username: "" });
  }

  async login(ctx, userId, password) {
    const user = await ctx.stub.getState(userId);
    if (!user || user.length === 0)
      throw new Error(`User ${userId} doesn't exists in the system!`);
    let userParse = JSON.parse(user.toString());
    let hash = this._hashCode(password);
    if (userParse.password === hash) {
      return JSON.stringify({ status: true, password: hash });
    }
    return JSON.stringify({
      status: false,
      password: hash,
    });
  }

  async getUserHistory(ctx, userId) {
    if (userId.length < 1) {
      throw new Error("userId is required as input");
    }

    var orderAsBytes = await ctx.stub.getState(userId);

    if (!orderAsBytes || orderAsBytes.length === 0) {
      throw new Error(
        `Error Message from getUserHistory: Order with userId = ${userId} does not exist.`
      );
    }

    const iterator = await ctx.stub.getHistoryForKey(userId);
    const userHistory = [];

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

        userHistory.push(jsonRes);
      }

      if (history.done) {
        await iterator.close();
        return JSON.stringify(userHistory);
      }
    }
  }

  _hashCode = function (password) {
    var hash = 0,
      i,
      chr;
    if (password.length === 0) return hash;
    for (i = 0; i < password.length; i++) {
      chr = password.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0;
    }
    return hash;
  };
}

module.exports = UserContract;
