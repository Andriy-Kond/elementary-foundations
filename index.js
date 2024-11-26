// console.log("process:::", process);
// console.log("process.env:::", process.env); // різні змінні. Можна додавати свої змінні.
console.log("process.argv:::", process.argv); // шлях до node.exe та файлу виконання (наприклад, index.js)

console.log("__dirname :>> ", __dirname); // працює лише з модулями CommonJS. З модулями ECMAScript ("type": "module") треба використовувати path з node.js:
// import path from "path";
// import { fileURLToPath } from "url";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// До того ж path.join() нормалізує шлях розставляючи правильно слеши в залежності від системи ( "\" або "/")

const path = require("path");

const pathToContactJs = path.join(__dirname, "contacts.json");

// Під час запуску скрипту (index.js) він запам'ятає абсолютний шлях поточного __dirname і далі при звертанні до функції (getAll) буде використовувати її експорт з запам'ятованим шляхом:
const fs = require("fs/promises");

const getAll = async () => {
  // const contacts = await fs.readFile(pathToContactJs, "utf-8");
  // JSON.parse() нормально перетворює Buffer, тому перетворювати buffer у рядок (contacts.toString()) чи вказувати кодування тексту ("utf-8") не обов'язково.
  const contacts = await fs.readFile(pathToContactJs);
  console.log("getAll >> contacts:::", contacts);
  console.log("getAll >> JSON.parse(contacts):::", JSON.parse(contacts));
  return JSON.parse(contacts);
};

getAll();

module.exports = { getAll };
