import tokenStoredToBeBlackListed from "../models/token.models.js";

const blackListedToken = async (tokenId) => {
  try {
    const blackListToken = await tokenStoredToBeBlackListed.create({ tokenSchemaId : tokenId });
    console.log ( blackListToken)
  } catch (error) {
    console.log("error in blackListedToken", error);
    return error;
  }
};

export default blackListedToken;
