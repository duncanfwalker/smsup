function join(statements) {
  return statements.filter(statement => statement !== '').join(' ');
}

module.exports = { join };
