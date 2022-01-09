const helper = require("../../utils/helperv2");

const orderAdminView = (req, res, next) => {
  res.render("admin/orders/orders", {
    layout: "layout",
    page_name: "order",
  });
};

const queryAllOrderAdmin = async (req, res, next) => {
  let org = req.query.org ? req.query.org : "supply";
  try {
    let result = await helper.queryAllOrders(org);
    let allOrder = JSON.parse(result.toString());
    if (allOrder) {
      for (let i = 0; i < allOrder.length; i++) {
        let userId = allOrder[i].Value.buyerId;
        if (userId) {
          let user = await helper.getUser(org, userId);
          let userResult = JSON.parse(user.toString());
          let userParse = JSON.parse(
            Buffer.from(userResult.data).toString("utf-8")
          );
          allOrder[i].Value.user = userParse;
        }
      }
      console.log(allOrder);
      await res.json({
        status: true,
        message: `Get all order  successfully!`,
        data: allOrder,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Get order fail. ERR: " + error.message,
    });
  }
};

const getHistoryOrderAdmin = (req, res, next) => {
  let orderId = req.params.id;

  let org = req.params.org ? req.params.org : "supply";
  if (org) {
    try {
      const history = helper.getHistoryOrder(orderId, org);
      history.then((historyResult) => {
        if (historyResult) {
          console.log(historyResult);
          res.json({
            history: JSON.parse(historyResult.toString()),
            status: true,
          });
        } else {
          res.status(404).json({
            status: false,
            message: `Not found result for ${orderId}`,
          });
        }
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error });
    }
  } else {
    res
      .status(404)
      .json({ status: false, message: "Failure to get data without org" });
  }
};

const assignShipper = async (req, res, next) => {
  let { orderId, newShipperId } = req.body;
  let org = req.query.org ? req.query.org : "supply";
  try {
    let userId = req.session.userId;
    if (userId) {
      let result = await helper.assignShipper(
        orderId,
        newShipperId,
        userId,
        org
      );
      let allOrder = JSON.parse(result.toString());
      await res.json({
        status: true,
        message: `Assign shipper for order successfully!`,
        data: allOrder,
      });
    } else {
      res.status(401).json({
        status: false,
        message: "Please login to use feature ",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Assign shipper for order order fail. ERR: " + error.message,
    });
  }
};

const createShipment = async (req, res, next) => {
  let { orderId, newTrackingInfo } = req.body;
  let org = req.query.org ? req.query.org : "supply";
  try {
    let userId = req.session.adminUserId;
    if (userId) {
      let result = await helper.createShipment(
        orderId,
        newTrackingInfo,
        userId,
        org
      );
      let allOrder = JSON.parse(result.toString());
      await res.json({
        status: true,
        message: `Create shipment for order successfully!`,
        data: allOrder,
      });
    } else {
      res.status(401).json({
        status: false,
        message: "Please login to use feature ",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Create shipment for order fail. ERR: " + error.message,
    });
  }
};

const transportShipment = async (req, res, next) => {
  let { orderId } = req.body;
  let org = req.query.org ? req.query.org : "supply";
  try {
    let userId = req.session.userId;
    if (userId) {
      let result = await helper.transportShipment(orderId, userId, org);
      let allOrder = JSON.parse(result.toString());
      await res.json({
        status: true,
        message: `Transport shipment for order successfully!`,
        data: allOrder,
      });
    } else {
      res.status(401).json({
        status: false,
        message: "Please login to use feature ",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Transport shipment for order fail. ERR: " + error.message,
    });
  }
};

const receiveShipment = async (req, res, next) => {
  let { orderId } = req.body;
  let org = req.query.org ? req.query.org : "supply";
  try {
    let userId = req.session.userId;
    if (userId) {
      let result = await helper.receiveShipment(orderId, userId, org);
      let allOrder = JSON.parse(result.toString());
      await res.json({
        status: true,
        message: `Receive shipment for order successfully!`,
        data: allOrder,
      });
    } else {
      res.status(401).json({
        status: false,
        message: "Please login to use feature ",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Receive shipment for order fail. ERR: " + error.message,
    });
  }
};

const closeOrder = async (req, res, next) => {
  let { orderId } = req.body;
  let org = req.query.org ? req.query.org : "supply";
  try {
    let userId = req.session.userId;
    if (userId) {
      let result = await helper.receiveShipment(orderId, userId, org);
      let allOrder = JSON.parse(result.toString());
      await res.json({
        status: true,
        message: `Receive shipment for order successfully!`,
        data: allOrder,
      });
    } else {
      res.status(401).json({
        status: false,
        message: "Please login to use feature ",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Receive shipment for order fail. ERR: " + error.message,
    });
  }
};

module.exports = {
  orderAdminView,
  queryAllOrderAdmin,
  getHistoryOrderAdmin,
  createShipment,
  assignShipper,
  receiveShipment,
  transportShipment,
};
