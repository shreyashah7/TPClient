var licenceTypeElements = function () {
    this.repeaterLicenceTypes = 'licence in licenceType.licenceTypeList';
    this.addNewLink = element(by.id('addNewLicenceTypeLink'));
    this.licenceClass1Input = element(by.id('licenceClass1Input'));
    this.vehicleSize1Input = element(by.id('vehicleSize1Input'));
    this.licenceClass1Selection = element(by.xpath("//*[@id='licenceClass1_chosen']/a/span"));
    this.licenceClass1Options = element.all(by.xpath("//*[@id='licenceClass1_chosen']//ul//li"));
    this.licenceClass1Chosen = "licenceClass1_chosen";
    this.vehicleSize1Chosen = "vehicleSize1_chosen";
    this.saveButton = element(by.id('btnSave'));
    this.licenceClass1text = element(by.xpath("//*[@id='licenceClass1_chosen']//a//span"));
    this.duplicateEntryMessage = "Duplicate entry for this combination";
    this.licenceTypeTable = element(by.id('licenceTypeTable'));
};
module.exports = new licenceTypeElements();