const ApplicationPolicy = require("./application");

module.exports = class PostPolicy extends ApplicationPolicy {

    constructor(user) {
        this.user = user;
    }

    new() {
        return this.user != null;
    }

    create() {
        return this.new();
    }

    edit() {
        return this._isAdmin();
    }

    update() {
        return this.edit();
    }

    destroy() {
        return this.update();
    }
}