entity Products {
    key ID       : UUID;
        name     : String(100);
        plant    : Plants:ID;
        price    : Decimal(13, 2);
        currency : String(5) default 'EUR';
        toPlant  : Association to Plants
                       on toPlant.ID = $self.plant;
};

entity Plants {
    key ID       : String(4);
        name     : String(40);
        location : String(40);
};

entity SalesHeaders {
    key ID           : UUID;
        totalPrice   : Products:price;
        currency     : Products:currency default 'EUR';
        createdAt    : DateTime @cds.on.insert: $now;
        toSalesItems : Composition of many SalesItems
                           on toSalesItems.toSalesHeader = $self;
};

entity SalesItems {
    key salesID       : SalesHeaders:ID;
    key itemNo        : Integer;
        productID     : Products:ID;
        quantity      : Integer;
        unitPrice     : Products:price;
        currency      : Products:currency default 'EUR';
        toSalesHeader : Association to SalesHeaders
                            on toSalesHeader.ID = $self.salesID;
        toProduct     : Association to Products
                            on toProduct.ID = $self.productID;
};
