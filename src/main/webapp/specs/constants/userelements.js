var licenceTypeElements = function () {
    this.repeaterUsers = 'user in userCtrl.userList';
    this.addNewLink = element(by.id('addNewUserLink'));
    this.email1 = element(by.id('email1'));
    this.firstName1 = element(by.id('firstName1'));
    this.surName1 = element(by.id('surName1'));
    this.saveButton = element(by.id('btnSave'));
    this.duplicateEmailIdErrorElement = element(by.xpath("//*[contains(text(),'User with same email id exists')]"));
};
module.exports = new licenceTypeElements();