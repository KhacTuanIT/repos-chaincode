"use strict";

var { Gateway, Wallets } = require("fabric-network");
const path = require("path");
const FabricCAServices = require("fabric-ca-client");
const fs = require("fs");

const util = require("util");

const getCCP = async () => {
  let ccpPath = path.resolve(__dirname, "../connection.json");
  const ccpJSON = fs.readFileSync(ccpPath, "utf8");
  const ccp = JSON.parse(ccpJSON);
  return ccp;
};

const getMspId = async (org) => {
  if (!org) return null;
  const ccp = await getCCP();
  const mspId = ccp.organizations[org + ".teco.com"].mspid;
  return mspId;
};

// get certificate authority url
const getCaUrl = async (org, ccp) => {
  if (!org) {
    return null;
  }
  let caURL = ccp.certificateAuthorities["ca1." + org + ".teco.com"].url;
  return caURL;
};

const getWalletPath = async (org) => {
  let walletPath = path.join(
    process.cwd(),
    "../../profiles/vscode/wallets/" + org + ".teco.com"
  );
  return walletPath;
};

const getAffiliation = async (org) => {
  return org + ".department1";
};

const getRegisteredUser = async (
  username,
  password,
  userType,
  userOrg,
  isJson
) => {
  let ccp = await getCCP();

  const caURL = await getCaUrl(userOrg, ccp);
  const ca = new FabricCAServices(caURL);

  const walletPath = await getWalletPath(userOrg);
  const wallet = await Wallets.newFileSystemWallet(walletPath);
  console.log(`Wallet path: ${walletPath}`);

  const userIdentity = await wallet.get(username);
  if (userIdentity) {
    console.log(
      `An identity for the user ${username} already exists in the wallet`
    );
    var response = {
      success: true,
      message: username + " enroled successfully",
    };
    return response;
  }

  let adminIdentity = await wallet.get("admin1");
  if (!adminIdentity) {
    console.log(
      'An identity for the admin user "Admin" does not exist in the wallet'
    );
    await enrollAdmin(userOrg);
    adminIdentity = await wallet.get("admin1");
    console.log("Admin enrolled successfully");
  }

  const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
  const adminUser = await provider.getUserContext(adminIdentity, "admin1");
  let secret;
  try {
    secret = await ca.register(
      {
        enrollmentID: username,
        enrollmentSecret: password,
        role: "client",
        attrs: [
          {
            name: "usertype",
            value: userType,
          },
        ],
        maxEnrollments: 15,
      },
      adminUser
    );
  } catch (error) {
    return error.message;
  }

  const enrollment = await ca.enroll({
    enrollmentID: username,
    enrollmentSecret: secret,
  });

  let x509Identity = {
    credentials: {
      certificate: enrollment.certificate,
      privateKey: enrollment.key.toBytes(),
    },
    mspId: await getMspId(userOrg),
    type: "X.509",
  };

  // await wallet.put(username, x509Identity);
  console.log(
    `Successfully registered and enrolled admin user ${username} and imported it into the wallet`
  );

  var response = {
    success: true,
    message: username + " enrolled Successfully",
    privateKey: enrollment.key.toBytes(),
  };
  return response;
};

const isUserRegistered = async (username, userOrg) => {
  const walletPath = await getWalletPath(userOrg);
  const wallet = await Wallets.newFileSystemWallet(walletPath);
  console.log(`Wallet path: ${walletPath}`);

  const userIdentity = await wallet.get(username);
  if (userIdentity) {
    console.log(`An identity for the user ${username} exists in the wallet`);
    return true;
  }
  return false;
};

const getCaInfo = async (org, ccp) => {
  if (!org) return null;
  let caInfo = ccp.certificateAuthorities["ca1." + org + ".teco.com"];
  return caInfo;
};

const enrollAdmin = async (org) => {
  console.log("calling enroll Admin method for " + org);
  try {
    const ccp = await getCCP();
    const caInfo = await getCaInfo(org, ccp);
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const ca = new FabricCAServices(
      caInfo.url,
      { trustedRoots: caTLSCACerts, verify: false },
      caInfo.caName
    );

    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    const identity = await wallet.get("admin");
    if (identity) {
      console.log(
        'An identity for the admin user "admin" already exists in the wallet'
      );
      return;
    }

    const enrollment = await ca.enroll({
      enrollmentID: "admin",
      enrollmentSecret: "adminpw",
      attrs: [
        {
          name: "usertype",
          value: "admin",
          ecert: true,
        },
      ],
    });
    let mspId = await getMspId(org);
    let x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: mspId,
      type: "X.509",
    };

    await wallet.put("admin", x509Identity);
    console.log(
      'Successfully enrolled admin user "admin" and imported it into the wallet'
    );
    return;
  } catch (error) {
    throw new Error({
      message: `Failed to enroll admin user "admin": ${error}`,
    });
  }
};

const enrollAdminV2 = async (org) => {
  console.log("calling enroll Admin method");
  try {
    const ccp = await getCCP();
    console.log("CCP: ", ccp);
    const caInfo = await getCaInfo(org, ccp);
    console.log("CA INFO: ", caInfo);
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const ca = new FabricCAServices(
      caInfo.url,
      { trustedRoots: caTLSCACerts, verify: false },
      caInfo.caName
    );

    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    const identity = await wallet.get("tuantk");
    if (identity) {
      console.log(
        'An identity for the admin user "tuantk" already exists in the wallet'
      );
      return {
        success: true,
        message:
          'An identity for the admin user "tuantk" already exists in the wallet',
      };
    }

    const enrollment = await ca.enroll({
      enrollmentID: "tuantk",
      enrollmentSecret: "adminpw",
      attr_reqs: [
        {
          name: "usertype",
          value: "admin",
          ecert: true,
        },
      ],
    });

    let x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: await getMspId(org),
      type: "X.509",
    };

    await wallet.put("tuantk", x509Identity);
    console.log(
      'Successfully enrolled admin user "tuantk" and imported it into the wallet'
    );
    return {
      success: true,
      message: "Enrolled successfully admin for " + org,
    };
  } catch (error) {
    console.error(`Failed to enroll admin user "tuantk": ${error}`);
    return;
  }
};

const registerAndGetSecret = async (username, password, userType, userOrg) => {
  try {
    let ccp = await getCCP();

    const caURL = await getCaUrl(userOrg, ccp);
    console.log("caURL: ", caURL);

    const ca = new FabricCAServices(caURL);
    console.log("CA: ", ca);
    const walletPath = await getWalletPath(userOrg);
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);
    console.log(`Wallet: ${wallet}`);

    const userIdentity = await wallet.get(username);
    console.log("USER IDENTITY: ", userIdentity);
    if (userIdentity) {
      console.log(
        `An identity for the user ${username} already exists in the wallet`
      );
      var response = {
        success: true,
        message: username + " enrolled Successfully",
      };
      return response;
    }

    let adminIdentity = await wallet.get("admin");
    console.log("ADMIN IDENTITY: ", adminIdentity);
    if (!adminIdentity) {
      console.log(
        'An identity for the admin user "admin" does not exist in the wallet'
      );
      await enrollAdmin(userOrg, ccp);
      adminIdentity = await wallet.get("admin");
      console.log("Admin Enrolled Successfully");
    }

    const provider = wallet
      .getProviderRegistry()
      .getProvider(adminIdentity.type);
    console.log("PROVIDER: ", provider);
    const adminUser = await provider.getUserContext(adminIdentity, "admin");
    console.log("ADMIN USER: ", adminUser);

    // const aff = await getAffiliation(userOrg);
    // console.log("AFF: ", aff);
    let secret = await ca.register(
      {
        // affiliation: aff,
        enrollmentID: username,
        enrollmentSecret: password,
        role: "client",
        attrs: [
          {
            name: "usertype",
            value: userType,
          },
        ],
      },
      adminUser
    );
    var response = {
      success: true,
      message: username + " register successfully",
      secret: secret,
    };

    return response;
  } catch (error) {
    console.log("ERROR REGISTER: ", error);
    return error.message;
  }
};

// ##### ####### #####
// ##### PRODUCT #####
// ##### ####### #####

const initDataProduct = async (org) => {
  try {
    let ccp = await getCCP();
    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const userIdentity = await wallet.get("admin");
    if (!userIdentity) {
      return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "ProductContract");

    const result = await contract.submitTransaction("initProductLedger");
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getProduct = async function (org, productCode) {
  try {
    let ccp = await getCCP();

    const caURL = await getCaUrl(org, ccp);

    const ca = new FabricCAServices(caURL);
    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const userIdentity = await wallet.get("admin");
    console.log(userIdentity);
    if (!userIdentity) {
      return;
    }
    console.log("pass");

    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco");

    const result = await contract.evaluateTransaction(
      "queryProduct",
      productCode
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllProduct = async function (org) {
  try {
    let ccp = await getCCP();

    const caURL = await getCaUrl(org, ccp);

    const ca = new FabricCAServices(caURL);
    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const userIdentity = await wallet.get("admin");
    if (!userIdentity) {
      return;
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "ProductContract");

    const result = await contract.evaluateTransaction("queryAllProducts");
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const addProduct = async function (product, org) {
  try {
    let ccp = await getCCP();
    console.log(org);
    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    console.log(wallet);
    const userIdentity = await wallet.get("admin");
    if (!userIdentity) {
      return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "ProductContract");

    const result = await contract.submitTransaction(
      "createProductLedger",
      product.name,
      product.code,
      product.manufactororId,
      product.color,
      product.price,
      product.cpu,
      product.ram,
      product.screen,
      product.keyboard,
      product.storage,
      product.network,
      product.usb,
      product.origin,
      product.yearOrigin,
      product.owner,
      product.primaryImage,
      product.subImage,
      product.description,
      product.updated_by
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const editProduct = async function (product, org) {
  try {
    let ccp = await getCCP();
    console.log(org);
    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    console.log(wallet);
    const userIdentity = await wallet.get("admin");
    if (!userIdentity) {
      return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "ProductContract");

    const result = await contract.submitTransaction(
      "updateProductInformation",
      product.name,
      product.code,
      product.manufactororId,
      product.color,
      product.price,
      product.cpu,
      product.ram,
      product.screen,
      product.keyboard,
      product.storage,
      product.network,
      product.usb,
      product.origin,
      product.yearOrigin,
      product.owner,
      product.primaryImage,
      product.subImage,
      product.description,
      product.updated_by
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteProduct = async function (productCode, updated_by, org) {
  try {
    let ccp = await getCCP();
    console.log(org);
    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    console.log(wallet);
    const userIdentity = await wallet.get("admin");
    if (!userIdentity) {
      return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "ProductContract");

    const result = await contract.submitTransaction(
      "deleteProduct",
      productCode,
      updated_by
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getProductHistory = async function (productCode, org) {
  try {
    let ccp = await getCCP();
    console.log(org);
    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    console.log(wallet);
    const userIdentity = await wallet.get("admin");
    if (!userIdentity) {
      return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "ProductContract");

    const result = await contract.evaluateTransaction(
      "getProductHistory",
      productCode
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

// ##### #### #####
// ##### USER #####
// ##### #### #####

const initDataUser = async (org) => {
  try {
    let ccp = await getCCP();
    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const userIdentity = await wallet.get("admin");
    if (!userIdentity) {
      return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "UserContract");

    const result = await contract.submitTransaction("initUser");
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const addUserForOrg = async function (user) {
  try {
    let ccp = await getCCP();
    const walletPath = await getWalletPath(user.org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const userIdentity = await wallet.get("admin");
    if (!userIdentity) {
      return;
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "UserContract");

    const result = await contract.submitTransaction(
      "createUser",
      user.userId,
      user.username,
      user.firstname,
      user.middlename,
      user.lastname,
      user.password,
      user.email,
      user.address,
      user.role,
      user.manager,
      user.org,
      user.updated_by
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const changeUserInformation = async function (user) {
  try {
    let ccp = await getCCP();
    const walletPath = await getWalletPath(user.org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const userIdentity = await wallet.get("admin");
    if (!userIdentity) {
      return;
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "UserContract");
    user.role = "";
    user.manager = "";
    user.updated_by = "admin";

    const result = await contract.submitTransaction(
      "changeUserInformation",
      user.userId,
      user.firstname,
      user.middlename,
      user.lastname,
      user.email,
      user.address,
      user.role,
      user.manager,
      user.org,
      user.updated_by
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const changePassword = async function (user) {
  try {
    let ccp = await getCCP();
    const walletPath = await getWalletPath(user.org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const userIdentity = await wallet.get("admin");
    if (!userIdentity) {
      return;
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "UserContract");

    const result = await contract.submitTransaction(
      "changePassword",
      user.userId,
      user.password,
      "admin"
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getUser = async function (org, userId) {
  try {
    let ccp = await getCCP();

    const caURL = await getCaUrl(org, ccp);

    const ca = new FabricCAServices(caURL);
    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const userIdentity = await wallet.get("admin");
    console.log(userIdentity);
    if (!userIdentity) {
      return;
    }
    console.log("pass");

    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "UserContract");

    const result = await contract.evaluateTransaction("queryUser", userId);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllUser = async function (org, manager) {
  try {
    let ccp = await getCCP();

    const caURL = await getCaUrl(org, ccp);

    const ca = new FabricCAServices(caURL);
    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const userIdentity = await wallet.get("admin");
    if (!userIdentity) {
      return;
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "UserContract");

    const result = await contract.evaluateTransaction(
      "queryAllUserByManager",
      manager
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const loginUser = async function (user) {
  try {
    let ccp = await getCCP();

    const walletPath = await getWalletPath(user.org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const userIdentity = await wallet.get("admin");
    if (!userIdentity) {
      return;
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "UserContract");

    const result = await contract.evaluateTransaction(
      "login",
      user.userId,
      user.password
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getUserByUsername = async function (user) {
  try {
    let ccp = await getCCP();
    const walletPath = await getWalletPath(user.org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const userIdentity = await wallet.get("admin");
    if (!userIdentity) {
      return;
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "UserContract");

    const result = await contract.evaluateTransaction(
      "getUserByUsername",
      user.username
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

// #### ############ ######
// #### MANUFACTURER ######
// #### ############ ######

const initDataManufacturer = async (org) => {
  try {
    let ccp = await getCCP();
    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const userIdentity = await wallet.get("admin");
    if (!userIdentity) {
      return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "ManufacturerContract");

    const result = await contract.submitTransaction("initManufacturer");
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const addManufacturer = async function (manufacturer, org) {
  try {
    let ccp = await getCCP();
    console.log(org);
    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    console.log(wallet);
    const userIdentity = await wallet.get("admin");
    if (!userIdentity) {
      return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "ManufacturerContract");

    const result = await contract.submitTransaction(
      "createManufacturer",
      manufacturer.manufactororId,
      manufacturer.name,
      manufacturer.updated_by
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const editManufacturer = async function (manufacturer, org) {
  try {
    let ccp = await getCCP();
    console.log(org);
    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    console.log(wallet);
    const userIdentity = await wallet.get("admin");
    if (!userIdentity) {
      return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "ManufacturerContract");

    const result = await contract.submitTransaction(
      "updateManufacturer",
      manufacturer.manufactororId,
      manufacturer.name,
      manufacturer.updated_by
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteManufacturer = async function (manufactororId, updated_by, org) {
  try {
    let ccp = await getCCP();
    console.log(org);
    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    console.log(wallet);
    const userIdentity = await wallet.get("admin");
    if (!userIdentity) {
      return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "ManufacturerContract");

    const result = await contract.submitTransaction(
      "deleteManufacturer",
      manufactororId,
      updated_by
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getHistoryManufacturer = async function (manufactororId, org) {
  try {
    let ccp = await getCCP();
    console.log(org);
    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    console.log(wallet);
    const userIdentity = await wallet.get("admin");
    if (!userIdentity) {
      return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "ManufacturerContract");

    const result = await contract.evaluateTransaction(
      "getManufacturerHistory",
      manufactororId
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getManufacturer = async function (org, manufactororId) {
  try {
    let ccp = await getCCP();

    const caURL = await getCaUrl(org, ccp);

    const ca = new FabricCAServices(caURL);
    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const userIdentity = await wallet.get("admin");
    console.log(userIdentity);
    if (!userIdentity) {
      return;
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "ManufacturerContract");

    const result = await contract.evaluateTransaction(
      "queryManufacturer",
      manufactororId
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllManufacturer = async function (org) {
  try {
    let ccp = await getCCP();

    const caURL = await getCaUrl(org, ccp);

    const ca = new FabricCAServices(caURL);
    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const userIdentity = await wallet.get("admin");
    if (!userIdentity) {
      return;
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "ManufacturerContract");

    const result = await contract.evaluateTransaction("queryAllManufactureres");
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

// ##### ########### #####
// ##### PRODUCTTPYE #####
// ##### ########### #####

const initDataProductType = async (org) => {
  try {
    let ccp = await getCCP();
    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const userIdentity = await wallet.get("admin");
    if (!userIdentity) {
      return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "ProductTypeContract");

    const result = await contract.submitTransaction("initProductType");
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getProductType = async function (org, productTypeId) {
  try {
    let ccp = await getCCP();

    const caURL = await getCaUrl(org, ccp);

    const ca = new FabricCAServices(caURL);
    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const userIdentity = await wallet.get("admin");
    console.log(userIdentity);
    if (!userIdentity) {
      return;
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "ProductTypeContract");

    const result = await contract.evaluateTransaction(
      "queryProductType",
      productTypeId
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllProductType = async function (org) {
  try {
    let ccp = await getCCP();

    const caURL = await getCaUrl(org, ccp);

    const ca = new FabricCAServices(caURL);
    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const userIdentity = await wallet.get("admin");
    if (!userIdentity) {
      return;
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "ProductTypeContract");

    const result = await contract.evaluateTransaction("queryAllProductTypes");
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const addProductType = async function (productType, org) {
  try {
    let ccp = await getCCP();
    console.log(org);
    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    console.log(wallet);
    const userIdentity = await wallet.get("admin");
    if (!userIdentity) {
      return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "ProductTypeContract");

    const result = await contract.submitTransaction(
      "createProductType",
      productType.productTypeId,
      productType.name,
      productType.updated_by
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const editProductType = async function (productType, org) {
  try {
    let ccp = await getCCP();
    console.log(org);
    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    console.log(wallet);
    const userIdentity = await wallet.get("admin");
    if (!userIdentity) {
      return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "ProductTypeContract");

    const result = await contract.submitTransaction(
      "updateProductType",
      productType.manufactororId,
      productType.name,
      productType.updated_by
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteProductType = async function (productTypeId, updated_by, org) {
  try {
    let ccp = await getCCP();
    console.log(org);
    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    console.log(wallet);
    const userIdentity = await wallet.get("admin");
    if (!userIdentity) {
      return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "ProductTypeContract");

    const result = await contract.submitTransaction(
      "deleteProductType",
      productTypeId,
      updated_by
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getHistoryProductType = async function (productTypeId, org) {
  try {
    let ccp = await getCCP();
    console.log(org);
    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    console.log(wallet);
    const userIdentity = await wallet.get("admin");
    if (!userIdentity) {
      return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "ProductTypeContract");

    const result = await contract.evaluateTransaction(
      "getProductTypeHistory",
      productTypeId
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

// ##### ####### #####
// ##### ORDERS  #####
// ##### ####### #####

const addOrder = async function (order, org) {
  try {
    let ccp = await getCCP();
    console.log(org);
    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    console.log(wallet);
    const userIdentity = await wallet.get("admin");
    if (!userIdentity) {
      return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "SupplyContract");

    const result = await contract.submitTransaction(
      "orderProduct",
      order.orderId,
      order.price,
      order.retailerId,
      order.updated_by,
      order.buyerId
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const createOrderDetail = async function (orderDetail, org) {
  try {
    let ccp = await getCCP();
    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const userIdentity = await wallet.get("admin");
    if (!userIdentity) {
      return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "OrderDetailContract");

    const result = await contract.submitTransaction(
      "createOrderDetail",
      orderDetail.orderDetailId,
      orderDetail.orderId,
      orderDetail.productId,
      orderDetail.price,
      orderDetail.quantity,
      orderDetail.updated_by
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const updateOrderDetail = async function (orderDetail, org) {
  try {
    let ccp = await getCCP();
    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const userIdentity = await wallet.get("admin");
    if (!userIdentity) {
      return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "OrderDetailContract");

    const result = await contract.submitTransaction(
      "updateOrderDetail",
      orderDetail.orderDetailId,
      orderDetail.orderId,
      orderDetail.productId,
      orderDetail.price,
      orderDetail.quantity,
      orderDetail.updated_by
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const receiceOrder = async function (orderId, userId, org) {
  try {
    let ccp = await getCCP();
    console.log(org);
    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    console.log(wallet);
    const userIdentity = await wallet.get("admin");
    if (!userIdentity) {
      return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "SupplyContract");

    const result = await contract.submitTransaction(
      "receiveOrder",
      orderId,
      userId
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const assignShipper = async function (orderId, newShipperId, userId, org) {
  try {
    let ccp = await getCCP();
    console.log(org);
    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    console.log(wallet);
    const userIdentity = await wallet.get("admin");
    if (!userIdentity) {
      return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "SupplyContract");

    const result = await contract.submitTransaction(
      "assignShipper",
      orderId,
      newShipperId,
      userId
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const createShipment = async function (orderId, newTrackingInfo, userId, org) {
  try {
    let ccp = await getCCP();
    console.log(org);
    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    console.log(wallet);
    const userIdentity = await wallet.get("admin");
    if (!userIdentity) {
      return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "SupplyContract");

    const result = await contract.submitTransaction(
      "createShipment",
      orderId,
      newTrackingInfo,
      userId
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const transportShipment = async function (orderId, userId, org) {
  try {
    let ccp = await getCCP();
    console.log(org);
    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    console.log(wallet);
    const userIdentity = await wallet.get("admin");
    if (!userIdentity) {
      return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "SupplyContract");

    const result = await contract.submitTransaction(
      "transportShipment",
      orderId,
      userId
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const receiveShipment = async function (orderId, userId, org) {
  try {
    let ccp = await getCCP();
    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const userIdentity = await wallet.get("admin");
    if (!userIdentity) {
      return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "SupplyContract");

    const result = await contract.submitTransaction(
      "receiveShipment",
      orderId,
      userId
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const queryOrder = async function (orderId, org) {
  try {
    let ccp = await getCCP();
    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const userIdentity = await wallet.get("admin");
    if (!userIdentity) {
      return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "SupplyContract");

    const result = await contract.evaluateTransaction("queryOrder", orderId);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const queryOrderDetail = async function (orderDetailId, org) {
  try {
    let ccp = await getCCP();
    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const userIdentity = await wallet.get("admin");
    if (!userIdentity) {
      return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "OrderDetailContract");

    const result = await contract.evaluateTransaction(
      "queryOrderDetail",
      orderDetailId
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const queryAllOrderDetailByOrderid = async function (orderId, org) {
  try {
    let ccp = await getCCP();
    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const userIdentity = await wallet.get("admin");
    if (!userIdentity) {
      return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "OrderDetailContract");

    const result = await contract.evaluateTransaction(
      "queryAllOrderDetailsByOrderId",
      orderId
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getOrderDetailHistory = async function (orderDetailId, org) {
  try {
    let ccp = await getCCP();
    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const userIdentity = await wallet.get("admin");
    if (!userIdentity) {
      return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "OrderDetailContract");

    const result = await contract.evaluateTransaction(
      "getOrderDetailHistory",
      orderDetailId
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const queryAllOrders = async function (org) {
  try {
    let ccp = await getCCP();
    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const userIdentity = await wallet.get("admin");
    if (!userIdentity) {
      return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "SupplyContract");

    const result = await contract.evaluateTransaction("queryAllOrders");
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const queryAllOrdersByUserId = async function (userId, org) {
  try {
    let ccp = await getCCP();
    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const userIdentity = await wallet.get("admin");
    if (!userIdentity) {
      return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "SupplyContract");

    const result = await contract.evaluateTransaction(
      "queryAllOrdersByUserId",
      userId
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getHistoryOrder = async function (orderId, org) {
  try {
    let ccp = await getCCP();
    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const userIdentity = await wallet.get("admin");
    if (!userIdentity) {
      return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("ecsupply");

    const contract = network.getContract("teco", "SupplyContract");

    const result = await contract.evaluateTransaction(
      "getOrderHistory",
      orderId
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

// ##### ####### #####
// ##### EXPANDS #####
// ##### ####### #####

var getLogger = function (moduleName) {
  var logger = log4js.getLogger(moduleName);
  logger.setLevel("DEBUG");
  return logger;
};

function getBase64(file) {
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    return reader.result;
  };
  reader.onerror = function (error) {
    return null;
  };
}

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

exports.getRegisteredUser = getRegisteredUser;
exports.getLogger = getLogger;

module.exports = {
  getMspId: getMspId,
  getCCP: getCCP,
  getWalletPath: getWalletPath,
  getRegisteredUser: getRegisteredUser,
  isUserRegistered: isUserRegistered,
  registerAndGetSecret: registerAndGetSecret,
  enrollAdminV2: enrollAdminV2,
  enrollAdmin: enrollAdmin,
  getProduct: getProduct,
  getAllProduct: getAllProduct,
  addProduct,
  editProduct,
  deleteProduct,
  getProductHistory,
  addUserForOrg,
  getUser,
  getAllUser,
  initDataManufacturer,
  initDataProductType,
  initDataProduct,
  initDataUser,
  getManufacturer,
  getAllManufacturer,
  editManufacturer,
  addManufacturer,
  deleteManufacturer,
  getHistoryManufacturer,
  getProductType,
  getAllProductType,
  addProductType,
  editProductType,
  deleteProductType,
  getHistoryProductType,
  getBase64,
  loginUser,
  getUserByUsername,
  changeUserInformation,
  changePassword,
  addOrder,
  receiceOrder,
  receiveShipment,
  createShipment,
  assignShipper,
  transportShipment,
  queryOrder,
  queryAllOrders,
  queryAllOrdersByUserId,
  getHistoryOrder,
  createOrderDetail,
  updateOrderDetail,
  getOrderDetailHistory,
  queryOrderDetail,
  queryAllOrderDetailByOrderid,
  uuidv4,
};
