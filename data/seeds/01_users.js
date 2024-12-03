exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('users').del()
      .then(function () {
        // Inserts seed entries
        return knex('users').insert([
          { username: 'user1', password: 'hashedpassword1' },
          { username: 'user2', password: 'hashedpassword2' },
          { username: 'user3', password: 'hashedpassword3' }
        ]);
      });
  };
  