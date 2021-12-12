const payment = (req, res, next) => {
  res.render("client/payment", {
    layout: "client-layout",
    page_name: "payment",
  });
};

module.exports = {
  payment,
};
