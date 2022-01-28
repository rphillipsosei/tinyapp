const getUserByEmail = (email, database) => {
    for (const element in database) {
      if (database[element].email === email) {
        return database[element];
      }
    }
    return undefined;
  };

  module.exports = {getUserByEmail}