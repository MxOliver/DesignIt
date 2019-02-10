'use strict';
module.exports = (sequelize, DataTypes) => {
  var Flair = sequelize.define('Flair', {
    name: {
      type: DataTypes.STRING
    },
    color: {
      type: DataTypes.STRING
    },
    topicId: {
      type: DataTypes.INTEGER
    }
  }, {});
  Flair.associate = function(models) {
    // associations can be defined here
    Flair.belongsTo(models.Topic, {
      foreignKey: "topicId",
      onDelete: "CASCADE"
    });
  };
  return Flair;
};