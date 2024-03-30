using {
    Products     as DBProducts,
    Plants       as DBPlants,
    SalesHeaders as DBSalesHeaders,
    SalesItems   as DBSalesItems
} from '../db/data-models';

service CompanySales {
    function generateSalesReport() returns many {
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
    
    action   updateProductPlant(productID : Products:ID, newPlant : Plants:ID) returns Boolean;

    entity Products     as select from DBProducts;
    entity Plants       as select from DBPlants;
    entity SalesHeaders as select from DBSalesHeaders;
    entity SalesItems   as select from DBSalesItems;
};
