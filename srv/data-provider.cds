using {
    Products     as DBProducts,
    Plants       as DBPlants,
    SalesHeaders as DBSalesHeaders,
    SalesItems   as DBSalesItems
} from '../db/data-models';

service CompanySales {
    type ProductPlant {
        productID : Products:ID;
        newPlant  : Plants:ID;
    };

    type SalesReport {
        salesID       : SalesHeaders:ID;
        itemNo        : SalesItems:itemNo;
        productID     : Products:ID;
        productName   : Products:name;
        plant         : Plants:ID;
        plantName     : Plants:name;
        plantLocation : Plants:location;
        price         : Products:price;
        currency      : Products:currency;
        quantity      : SalesItems:quantity;
    };

    function generateSalesReport()                      returns many SalesReport;
    action   updateProductPlant(product : ProductPlant) returns Boolean;
    
    entity Products     as select from DBProducts;
    entity Plants       as select from DBPlants;
    entity SalesHeaders as select from DBSalesHeaders;
    entity SalesItems   as select from DBSalesItems;
};
