const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const faker = require("faker");

const dbPath = "db";
const dbName = "db.sqlite3";

const COUNTRY_NUMBER = 10;
const USER_NUMBER = 100;
const MERCHANT_NUMBER = 30;
const PRODUCT_NUMBER = 150;
const ORDER_NUMBER = 300;

// Create database folder and file
let folderStat = fs.statSync(dbPath);
if (folderStat.isDirectory()) fs.rmSync(dbPath, {recursive: true, force: true});

fs.mkdirSync(dbPath);
fs.writeFileSync(`${dbPath}/${dbName}`, Buffer.alloc(0));

// Create tables
let db = new sqlite3.Database(`${dbPath}/${dbName}`);
db.serialize(() => {
    db.run(
        `CREATE TABLE countries (
        code int PRIMARY KEY,
        name varchar(100),
        continent_name varchar(100)
    );`);

    db.run(
        `CREATE TABLE users (
        id int PRIMARY KEY,
        full_name varchar(100) NOT NULL,
        email varchar(100) NOT NULL,
        gender varchar(100) NOT NULL,
        date_of_birth DATE NOT NULL,
        country_code int NOT NULL,
        created_at DATETIME NOT NULL,
        FOREIGN KEY (country_code) REFERENCES countries (code)
    );`);

    db.run(
        `CREATE TABLE merchants (
        id int PRIMARY KEY,
        merchant_name varchar(100) NOT NULL,
        admin_id int NOT NULL,
        country_code int NOT NULL,
        created_at DATETIME NOT NULL,
        FOREIGN KEY (admin_id) REFERENCES users(id),
        FOREIGN KEY (country_code) REFERENCES countries(code)
);`
    );

    db.run(
        `CREATE TABLE products (
        id int PRIMARY KEY,
        merchant_id int NOT NULL,
        name varchar(300) NOT NULL,
        price int NOT NULL,
        status varchar(100) NOT NULL,
        created_at DATETIME NOT NULL,
        FOREIGN KEY (merchant_id) REFERENCES merchants(id)
);`);

    db.run(
        `CREATE TABLE orders (
        id int PRIMARY KEY,
        user_id int NOT NULL,
        status varchar(100) NOT NULL,
        created_at DATETIME NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
);`);

    db.run(
        `CREATE TABLE order_items (
        order_id INT PRIMARY KEY,
        product_id int NOT NULL,
        quantity int NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
);`);

    // countries
    const countrySet = new Set();
    for (let i = 1; i <= COUNTRY_NUMBER;) {
        obj = {
            code: i,
            name: faker.address.country(),
            continent: ["Africa", "Antarctica", "Asia", "Australia", "Europe", "North America", "South America"][Math.floor(Math.random() * 7)]
        };
        if (!countrySet.has(obj.name)) {
            countrySet.add(obj.name);
            db.run(`INSERT INTO countries (code, name, continent_name) VALUES (?, ?, ?)`, [obj.code, obj.name, obj.continent]);
            i += 1;
        }
    }

    // users
    for (let i = 1; i <= USER_NUMBER; i++) {
        obj = {
            id: i,
            full_name: faker.name.findName(),
            email: faker.internet.email(),
            gender: faker.name.gender(),
            date_of_birth: faker.date.past(),
            country_code: Math.floor(Math.random() * COUNTRY_NUMBER) + 1,
            created_at: faker.date.recent()
        };
        db.run(`INSERT INTO users (id, full_name, email, gender, date_of_birth, country_code, created_at) VALUES (?, ?, ?, ?, ?, ?, ?);`
            , [obj.id, obj.full_name, obj.email, obj.gender, obj.date_of_birth, obj.country_code, obj.created_at]);
    }

    // merchants
    for (let i = 1; i <= MERCHANT_NUMBER; i++) {
        obj = {
            id: i,
            full_name: faker.name.findName(),
            admin_id: Math.floor(Math.random() * USER_NUMBER) + 1,
            country_code: Math.floor(Math.random() * COUNTRY_NUMBER) + 1,
            created_at: faker.date.recent()
        };
        db.run(`INSERT INTO merchants (id, merchant_name, admin_id, country_code, created_at) VALUES (?, ?, ?, ?, ?)`,
            [obj.id, obj.full_name, obj.admin_id, obj.country_code, obj.created_at])
    }

    //products
    for (let i = 1; i <= PRODUCT_NUMBER; i++) {
        obj = {
            id: i,
            merchant_id: Math.floor(Math.random() * MERCHANT_NUMBER) + 1,
            name: faker.commerce.productName(),
            price: faker.commerce.price(),
            status: ["Out of Stock", "In Stock"][Math.floor(Math.random() * 2)],
            created_at: faker.date.recent()
        };
        db.run(`INSERT INTO products (id, merchant_id, name, price, status, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
            [obj.id, obj.merchant_id, obj.name, obj.price, obj.status, obj.created_at])
    }

    // orders
    for (let i = 1; i <= ORDER_NUMBER; i++) {
        order = {
            id: i,
            user_id: Math.floor(Math.random() * USER_NUMBER) + 1,
            status: ["Placed", "Paid", "Completed"][Math.floor(Math.random() * 3)],
            created_at: faker.date.recent()
        };

        order_item = {
            order_id: i,
            product_id: Math.floor(Math.random() * PRODUCT_NUMBER) + 1,
            quantity: Math.floor(Math.random() * 10)
        };

        db.run(`INSERT INTO orders (id, user_id, status, created_at) VALUES (?, ?, ?, ?)`,
            [order.id, order.user_id, order.status, order.created_at]);
        db.run(`INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)`,
            [order_item.order_id, order_item.product_id, order_item.quantity])
    }
});
