const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/libros.json');

function readData() {
  const json = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(json);
}

function writeData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = { readData, writeData };
