import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "users.db",
});

const PORT = 5000;

const app = express();

app.use(express.json());

app.get("/", async (_req, res) => {
  try {
    const data = await getAll();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: "ошибка" });
  }
});

app.post("/", async (req, res) => {
  try {
    const { name, password } = req.body;
    await addUser(name, password);
    res.status(200).json("Запись добавлена!");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/", async (req, res) => {
    try{
        deleteAll()
        res.status(200).json("Все записи удалены!");
    }
    catch(error){
        res.status(400).json({ message: error.message });
    }
})

app.listen(PORT, () => {
  console.log("Server started....");
});

connectBD()

async function connectBD() {
  try {
    await sequelize.authenticate();
    console.log("Database open...");
  } catch (error) {
    console.error(error.message);
  }
}

async function closeBD() {
  try {
    await sequelize.close();
    console.log("Database close...");
  } catch (error) {
    console.error(error.message);
  }
}

async function addUser(name, password) {
  try {
    await sequelize.query(
      `INSERT INTO users (name, password) VALUES ("${name}", "${password}")`
    );
    console.log("запись успешно добавлена");
  } catch (error) {
    console.error(error.message);
  }
}

async function getAll() {
  const [results, metadata] = await sequelize.query("SELECT * FROM users");
  console.log(results);
  return results;
}

async function deleteAll() {
  try {
    await sequelize.query("DELETE FROM users");
    console.log("Все записи удалены");
  } catch (error) {
    console.error(error.message);
  }
}
