const ApplicationPolicy = require("./application");

module.exports = class CommentPolicy extends ApplicationPolicy {

    destroy() {
        return this.record && (this._isAdmin || this._isOwner);
    }

}