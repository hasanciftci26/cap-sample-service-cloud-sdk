const cds = require("@sap/cds");

class CompanySales extends cds.ApplicationService {
    init() {
        this.before("CREATE", "SalesHeaders", (req) => {
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
            await db.run(UPDATE(Products, { ID: req.data.product.productID }).with({ plant: req.data.product.newPlant }));
            return true;
        });

        return super.init();
    }
}

module.exports = CompanySales;