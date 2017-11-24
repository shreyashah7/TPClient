var loginElements = function () {

    this.userName = element(by.name('username'));
    this.password = element(by.name('password'));
    this.btnLoginForm = element(by.id('btnLoginForm'));
};
module.exports = new loginElements();