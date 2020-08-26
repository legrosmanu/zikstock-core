const ZikStockError = require('../main/helpers/zik-stock-error');

describe('zikstock-errors', () => {

    it('should get the good message if the code exists', () => {
        let error = new ZikStockError("400-1");
        expect(error.message === "The URL and the title are the mandatory fields to create a zikresource.");
    });

    it('should provide an empty message if the code doesn\'t exist', () => {
        let error = new ZikStockError("1");
        expect(error.message === "");
    });

});