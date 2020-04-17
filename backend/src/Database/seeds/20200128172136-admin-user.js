const bcrypt = require('bcryptjs');

module.exports = {
  up: async QueryInterface => {
    await QueryInterface.bulkInsert('users', [
      {
        name: 'Distribuidora FastFeet',
        email: 'admin@fastfeet.com',
        password_hash: bcrypt.hashSync('123456', 8),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    const users = await QueryInterface.sequelize.query(`SELECT id FROM users;`);

    return QueryInterface.bulkInsert(
      'admins',
      [
        {
          user_id: users[0][0].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: QueryInterface => QueryInterface.bulkDelete('users', null, {}),
};
