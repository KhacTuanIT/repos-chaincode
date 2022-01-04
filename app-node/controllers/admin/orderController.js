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

module.exports = {
  orderAdminView,
  queryAllOrderAdmin,
  getHistoryOrderAdmin,
};
