const db = require('../../data/dbConfig');

module.exports = {
  findByUsername,
  add,
};

function findByUsername(username) {
  return db('users').where({ username }).first();
}

async function add(user) {
  const [id] = await db('users').insert(user);
  return findById(id);
}
