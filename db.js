"use strict";

const sqlite3 = require("sqlite3").verbose();

const getAllRows = async (db, tableName) => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM ${tableName};`, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        })
    });
};

const dictify = (sampleList, keyField) => {
    const obj = {};
    for (const sample of sampleList) {
        obj[sample[keyField]] = sample;
    }
    return obj;
};

const loadDatabase = async () => {
    const databaseFilePath = "db/db.sqlite3";
    const db = new sqlite3.Database(databaseFilePath);

    const countrySamples = await getAllRows(db, "countries");
    const countries = dictify(countrySamples, "code");
    const users = dictify(await getAllRows(db, "users"), "id");
    const merchants = dictify(await getAllRows(db, "merchants"), "id");
    const products = dictify(await getAllRows(db, "products"), "id");
    const orders = dictify(await getAllRows(db, "orders"), "id");
    const order_items = dictify(await getAllRows(db, "order_items"), "order_id");

    return {countries, users, merchants, products, orders, order_items}
};

exports.loadDatabase = loadDatabase;
