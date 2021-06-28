"use strict";

const getUser = (users, userId) => {
    return users[userId];
};

const getAllUsers = (users) => {
    const out = Object.entries(users).map((row) => row[1]);
    console.log(out);
    return out;
};

exports.getUser = getUser;
exports.getAllUsers = getAllUsers;
