const AWS = require("aws-sdk");

const { getUser } = require("./users");
const { comparePassword, signToken } = require("../lib/utils");

const USERS_TABLE = process.env.USERS_TABLE;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

const signInUser = async (props) => {
  try {
    const user = await getUser({ userId: props.email });
    console.log({ user });

    const isValidPassword = await comparePassword(props.password, user.passwordHash);
    console.log({ isValidPassword });

    if (isValidPassword) {
      const token = await signToken(user);
      console.log({ token });
      return Promise.resolve({ auth: true, token: token, user, status: "SUCCESS" });
    } else {
      throw new Error("Invalid signin");
    }
  } catch (error) {
    throw new Error("Could not create user");
  }
};

module.exports = {
  signInUser,
};
