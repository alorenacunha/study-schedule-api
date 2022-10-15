const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const USERS_TABLE = process.env.USERS_TABLE;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

const createUser = async (props) => {
  if (typeof props.password !== "string") {
    res.status(400).json({ error: '"password" must be a string' });
  } else if (typeof props.name !== "string") {
    res.status(400).json({ error: '"name" must be a string' });
  }
  const passwordHash = await bcrypt.hash(props.password, 8); // hash the pass
  delete props.password;

  const params = {
    TableName: USERS_TABLE,
    Item: {
      userId: uuidv4(),
      name: props.name,
      passwordHash,
      createdAt: new Date().toUTCString(),
    },
  };

  console.log({ params });

  try {
    await dynamoDbClient.put(params).promise();
    res.json({ name: props.name, createdAt: new Date().toUTCString() });
  } catch (error) {
    throw new Error("Could not create user");
  }
};

module.exports = {
  createUser,
};
