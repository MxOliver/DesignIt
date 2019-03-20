'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Posts", "url", {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        isUrl: {msg: "must be a valid url"}
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Posts", "url");
  }
};
