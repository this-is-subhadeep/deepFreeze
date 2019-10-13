const serverConfig = {
    PORT: process.env.PORT || 8000,
    environment: {
        prod: false
    },
    logLocation: process.env.SERVER_LOGS || './logs',
    productURL: process.env.PRODUCT_URL || 'http://localhost:8010',
    vendorURL: process.env.VENDOR_URL || 'http://localhost:8020',
    inventoryURL: process.env.INVENTORY_URL || 'http://localhost:8030',
    fileURL: process.env.INVENTORY_URL || 'http://localhost:8040',
    userURL: process.env.USER_URL || 'http://localhost:8050'
}

module.exports = {
    serverConfig
}