const fs = require('fs'),
  path = require('path'),
  uuid = require('uuid'),
  bcrypt = require('bcryptjs'),
  jwt = require('jsonwebtoken');

const USER_DB_PATH = path.join(__dirname, '../db/users.json');

module.exports = {
  signup,
  login,
  getUserById,
  list,
  setRole,
  remove
};

async function list() {
  return await read();
}

async function signup(user) {
  const hashed_pw = bcrypt.hashSync(user.password, 10);
  const id = uuid();
  const newUser = { ...user, password: undefined, hashed_pw, id, role: 'user' };
  const users = await read();
  users.push(newUser);
  await write(users);
  return createToken(newUser);
}

async function login(creds) {
  try {
    const user = await getUserByEmail(creds.email);
    if (!bcrypt.compareSync(creds.password, user.hashed_pw)) {
      throw 'PASSWORD_MISMATCH';
    }
    return createToken(user);
  } catch (err) {
    throw err;
  }
}

async function getUserByEmail(email) {
  const users = await read();
  const matches = users.filter(user => user.email === email);
  if (!matches.length) {
    throw 'NO_MATCHING_USER';
  } else {
    return matches[0];
  }
}

async function getUserById(id) {
  const users = await read();
  const matches = users.filter(user => user.id === id);
  if (!matches.length) {
    throw 'NO_MATCHING_USER';
  } else {
    return { ...matches[0], hashed_pw: undefined };
  }
}

async function setRole(id, role) {
  const users = await read();
  const matches = users.filter(user => user.id === id);
  if (!matches.length) {
    throw 'NO_MATCHING_USER';
  } else {
    const user = matches[0];
    user.role = role;
    await write(users);
    return { ...user, hashed_pw: undefined };
  }
}

async function remove(id) {
  const users = await read();
  const idx = users.findIndex(user => user.id === id);
  if (idx === -1) {
    throw 'NO_MATCHING_USER';
  } else {
    const user = users[idx];
    users.splice(idx, 1);
    await write(users);
    return user;
  }
}

function read() {
  return new Promise((resolve, reject) => {
    fs.readFile(USER_DB_PATH, 'utf8', (err, data) => {
      resolve(JSON.parse(data));
    });
  });
}

function write(json) {
  return new Promise((resolve, reject) => {
    fs.writeFile(USER_DB_PATH, JSON.stringify(json), err => {
      resolve(json);
    });
  });
}

function createToken({ email, name, id, role }) {
  return jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
      email,
      name,
      id,
      role
    },
    process.env.SECRET
  );
}
