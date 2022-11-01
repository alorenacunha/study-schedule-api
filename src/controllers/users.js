const AWS = require("aws-sdk");

const bcrypt = require("bcryptjs");

const USERS_TABLE = process.env.USERS_TABLE;
const USERS_SETTINGS_TABLE = process.env.USERS_SETTINGS_TABLE;

const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

const createUser = async (props) => {
  if (typeof props.password !== "string") {
    throw new Error('"password" must be a string');
  } else if (typeof props.name !== "string") {
    throw new Error('"name" must be a string');
  }
  const passwordHash = await bcrypt.hash(props.password, 8); // hash the pass
  delete props.password;

  const params = {
    TableName: USERS_TABLE,
    Item: {
      userId: props.email,
      name: props.name,
      passwordHash,
      createdAt: new Date().toUTCString(),
    },
  };

  console.log({ params });

  try {
    await createUserSettings({ userId: props.email });
    await dynamoDbClient.put(params).promise();
    return { name: props.name, email: props.email, createdAt: new Date().toUTCString() };
  } catch (error) {
    console.log({ error });
    throw new Error("Could not create user");
  }
};

createUserSettings = async (props) => {
  const params = {
    TableName: USERS_SETTINGS_TABLE,
    Item: {
      userId: props.userId,
      days: {
        dom: false,
        seg: false,
        ter: false,
        qua: false,
        qui: false,
        sex: false,
        sab: false,
      },
      intervals: [
        {
          start: "00:00",
          end: "00:00",
        },
      ],
    },
  };

  console.log({ params });

  try {
    const resp = await dynamoDbClient.put(params).promise();
    console.log({ resp });
  } catch (error) {
    console.log({ error });
    throw new Error("Could not create settings");
  }
};
getUserSettings = async (props) => {
  const params = {
    TableName: USERS_SETTINGS_TABLE,
    Key: {
      userId: props.userId,
    },
  };

  console.log({ params });

  try {
    const response = await dynamoDbClient.get(params).promise();
    console.log({ response });
    if (response) {
      return response.Item;
    } else {
      throw new Error('Could not find user with provided "userId"');
    }
  } catch (error) {
    console.log({ error });
    throw new Error("Could not get user");
  }
};
updateUserSettings = async (props) => {
  const params = {
    TableName: USERS_SETTINGS_TABLE,
    Item: props,
  };

  console.log({ params });

  try {
    await dynamoDbClient.put(params).promise();
    return props;
  } catch (error) {
    console.log({ error });
    throw new Error("Could not update settings");
  }
};

const getUser = async (props) => {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: props.userId,
    },
  };

  console.log({ params });

  try {
    const { Item } = await dynamoDbClient.get(params).promise();
    if (Item) {
      return Item;
    } else {
      throw new Error('Could not find user with provided "userId"');
    }
  } catch (error) {
    console.log({ error });
    throw new Error("Could not get user");
  }
};

module.exports = {
  createUser,
  getUser,
  updateUserSettings,
  getUserSettings,
};
