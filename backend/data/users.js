import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Administrator',
    email: 'admin@email.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
    role: 'Admin',
  },

  {
    name: 'John Smith',
    email: 'john@email.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'Customer',
  },

  {
    name: 'Jane Smith',
    email: 'jane@email.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'Customer',
  },
];

export default users;