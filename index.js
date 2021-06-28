"use strict";

const express = require("express");
const {graphqlHTTP} = require("express-graphql");
const {buildSchema} = require('graphql');
const fs = require("fs");
const {loadDatabase} = require("./db");

const {getUser, getAllUsers} = require("./api/user");

const schemaContent = fs.readFileSync("./schema.graphql").toString();
const schema = buildSchema(schemaContent);

loadDatabase().then((db_samples) => {
    let app = express();

    const root = {
        user: (args) => getUser(db_samples["users"], args.id),
        users: () => getAllUsers(db_samples["users"])
    };


    app.use('/graphql', graphqlHTTP({
        schema: schema,  // Must be provided
        rootValue: root,
        graphiql: true,  // Enable GraphiQL when server endpoint is accessed in browser
    }));

    app.listen(4000, () => console.log('Now browse to http://localhost:4000/graphql'));
});

