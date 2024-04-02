const cds = require("@sap/cds");

class CompanySales extends cds.ApplicationService {
    init() {
        this.before("CREATE", "SalesHeaders", async (req) => {
            const db = await cds.connect.to("db");
            const { Products } = db.entities("CompanySales");
            let isNonExistingProduct = false;
            let nonExistingProductID = "";

            for (let item of req.data.toSalesItems) {
                const product = await db.run(SELECT.one.from(Products).where({ ID: item.productID }));

                if (!product) {
                    isNonExistingProduct = true;
                    nonExistingProductID = item.productID;
                    break;
                }

                item.unitPrice = product.price;
                item.currency = product.currency;
            }

            if (isNonExistingProduct) {
                return req.reject(404, `Product ID: ${nonExistingProductID} was not found!`);
            }

            req.data.totalPrice = req.data.toSalesItems.reduce((total, item) => total + (parseFloat(item.unitPrice) * item.quantity), 0);
        });

        this.on("generateSalesReport", async (req, next) => {
            const db = await cds.connect.to("db");
            const { SalesItems } = db.entities("CompanySales");
            const salesReport = await db.run(SELECT.from(SalesItems).columns(item => {
                item("*"),
                    item.toProduct(product => {
                        product.name,
                            product.plant,
                            product.toPlant(plant => {
                                plant.name,
                                    plant.location
                            })
                    })
            }));

            return salesReport.map((report) => {
                return {
                    salesID: report.salesID,
                    itemNo: report.itemNo,
                    productID: report.productID,
                    productName: report.toProduct.name,
                    plant: report.toProduct.plant,
                    plantName: report.toProduct.toPlant.name,
                    plantLocation: report.toProduct.toPlant.location,
                    price: report.unitPrice,
                    currency: report.currency,
                    quantity: report.quantity
                };
            });
        });

        this.on("updateProductPlant", async (req, next) => {
            const db = await cds.connect.to("db");
            const { Products } = db.entities;
            await db.run(UPDATE(Products, { ID: req.data.productID }).with({ plant: req.data.newPlant }));
            return true;
        });

        return super.init();
    }
}

module.exports = CompanySales;