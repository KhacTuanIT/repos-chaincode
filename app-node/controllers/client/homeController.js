const helper = require("../../utils/helperv2");

const home = async (req, res, next) => {
  try {
    let org = req.query.org ? req.query.org : "supply";
    let productResults = await helper.getAllProduct(org);
    let products = productResults
      ? JSON.parse(productResults.toString())
      : null;
    let desktops = [];
    let laptops = [];
    if (products) {
      let manufacturerResults = await helper.getAllManufacturer(org);
      let manufacturers = manufacturerResults
        ? JSON.parse(manufacturerResults.toString())
        : null;
      let typeResults = await helper.getAllProductType(org);
      let types = typeResults ? JSON.parse(typeResults.toString()) : null;
      let desktop = types.filter((type) => type.Value.name == "Desktop")[0];
      let laptop = types.filter((type) => type.Value.name == "Laptop")[0];
      products.forEach((product) => {
        product.Value.manufacturer = manufacturers.filter(
          (manufacturer) =>
            manufacturer.Value.manufactororId == product.Value.manufactororId
        )[0];
        if (product.Value.type == desktop.Value.productTypeId) {
          desktops.push(product);
        } else if (product.Value.type == laptop.Value.productTypeId) {
          laptops.push(product);
        }
      });
    }
    res.render("client/home", {
      layout: "client-layout",
      page_name: "home",
      laptops: laptops,
      desktops: desktops,
    });
  } catch (error) {
    console.log(error);
    res.render("404", {
      layout: "client-layout",
      page_name: "error",
    });
  }
};

module.exports = {
  home,
};
