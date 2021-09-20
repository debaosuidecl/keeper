const request = require("request");

async function findgender(name) {
  try {
    let gender = await getGender(name);
    gender = JSON.parse(gender).gender;
    console.log(gender);
    return gender;
  } catch (error) {
    console.log(error);
    return "Undefined";
  }
}

async function getGender(name) {
  return new Promise((resolve, reject) => {
    const gendersecretkey =
      "f3ecc5847cd7812c4596d8e044e139107db8576f2f2e42aed179caffb20f512d";
    request(
      {
        uri: `https://gender-api.com/get?name=${name}&key=${gendersecretkey}`,
        method: "GET",
      },
      function (error, response, body) {
        // console.log(body, "fromasyncrequest");
        if (error) reject(error);
        else resolve(body);
      }
    );
  });
}

module.exports = findgender;
