module.exports = (sequelize, DataTypes) => {
    const Human = sequelize.define("Human", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        birthday: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        confirmPassword: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    Human.associate = (models) => {
        // Define the association to Words
        Human.hasMany(models.Words, {
            foreignKey: 'humanId', // This will be the foreign key in the Words table
            as: 'words', // Alias for the association
        });
    };
    return Human
}