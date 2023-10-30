module.exports = (sequelize, DataTypes) => {
    const Words = sequelize.define("Words", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        word: {
            type: DataTypes.STRING,
            allowNull: false
        },
        meaning: {
            type: DataTypes.STRING,
            allowNull: false
        },
        humanId: { // Add this field as the foreign key
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    });

    Words.associate = (models) => {
        Words.belongsTo(models.Human, {
            foreignKey: 'humanId',
            as: 'human',
        });
    };

    return Words;
};
