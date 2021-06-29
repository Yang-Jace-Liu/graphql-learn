"use strict";

const getUser = (users, userId) => {
    const user = users[userId];
    const email = user.email;
    user.email = (args) => {
        if (!args.mask) return email;
        return "***@***.***";
    };
    return user;
};

const getAllUsers = (users) => {
    return Object.entries(users).map((row) => row[1]);
};

const addUser = (users, countries, user) => {
    const userObject = {...user};  // clone object
    userObject.id = Math.floor(Math.random() * 10000000) + 10000;
    userObject.created_at = new Date().getTime();
    userObject.country = countries[userObject.country_code];
    return userObject;
};

exports.getUser = getUser;
exports.getAllUsers = getAllUsers;
exports.addUser = addUser;
