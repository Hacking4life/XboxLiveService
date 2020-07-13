//@ts-check
const fs = require("fs");
module.exports.loadEnvironmentVariables = async function (updateObject) {
  return await fs
    .readFileSync(`${__dirname}/index.html`, "utf8")
    .replace("{ envVars }", `let env = ` + JSON.stringify(updateObject));
};
