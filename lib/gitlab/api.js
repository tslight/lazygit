const axios = require('axios');
const token = require('../args').chkToken();
const api = axios.create({
  baseURL: 'https://www.gitlab.com',
  headers: {'PRIVATE-TOKEN': token}
});

module.exports = api;
