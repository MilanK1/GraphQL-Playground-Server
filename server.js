const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const cors = require("cors");

const schema = buildSchema(`
    type User {
        id: Int!
        username: String
        password: String!
        clientId: Int!
    }

    type Client { 
        id: Int!
        name: String
        userId: Int!
    } 

    type Test {
      argument: String
    }

    type Mutation {
      updateUser( username: String, password: String, userId: Int!): User
      createUser(username: String, password: String): User
    }

    type Query {
        test(argumnet: String): Test
        getUser(userId: Int!): User
        getClient(id: Int!): Client
    }

  
`);

const users = [
  { id: 1, username: "User#1", password: "12343" },
  { id: 2, username: "user#2", password: "19292" },
  { id: 3, username: "user#3", password: "1999" },
];

const clients = [
  { id: 1, name: "client#1" },
  { id: 2, name: "client#2" },
  { id: 3, name: "client#3" },
];

const resolvers = {
  test: (args, ctx) => {
    console.log(args, "my args");
  },
  getUser: ({ userId }) => {
    return users.find((user) => user.id === userId);
  },
  getClient: ({ id }) => {
    return clients.find((client) => client.id === id);
  },
  createUser: ({ password, username }) => {
    users.push({ password: password, username: username, id: 4 });
    return users.find((user) => user.id === 4);
  },
  updateUser: ({ password, username, userId }) => {
    const foundUser = users.find((user) => user.id == +userId);
    const userIndx = users.indexOf(foundUser);
    if (userIndx === -1) {
      return "Incorrect format.";
    }
    const updatedUser = (users[userIndx] = {
      ...users[userIndx],
      password: password,
      username: username,
    });

    return updatedUser;
  },
};

const app = express();

app.use(
  "/graphql",
  cors({ origin: "http://localhost:3000" }),
  graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true,
  })
);

app.listen(4000, () => {
  console.log("App running on ", 4000);
});
