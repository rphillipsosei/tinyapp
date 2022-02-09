const getUserByEmail = (email, database) => {
    for (const element in database) {
      if (database[element].email === email) {
        return database[element];
      }
    }
    return undefined;
  };

  const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  function generateRandomString(length) {
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  
    return result;
  };
  
  function checkUser(email, users) {
    for (let element in users) {
      if (users[element].email === email) {
        return users[element];
      }
    }
    return null;
  };
  
  
  function urlsForUser(id) {
    let urls = {};
    for (let url in urlDatabase) {
      if (urlDatabase[url].userID === req.session.user_id) {
        urls[url] = urlDatabase[url];
      };
    };
    return urls;
  };
  
  module.exports = {getUserByEmail, generateRandomString, checkUser, urlsForUser}