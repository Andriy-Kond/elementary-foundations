// ES Module vs CommonJS
// ^ ES Module ("type": "module" у package.json). Або перейменовувати кожне розширення .js на .mjs
// ^ Щоб змусити Node.js обробляти файл як CommonJS модуль незалежно від налаштувань package.json можна перейменувати розширення .js на .cjs

// fs.readFile(filename, [options]) – читання файлу
// fs.writeFile(filename, data, [options]) – запис файлу (перезаписує файл або, у випадку з текстом, перезаписує зміст файлу). Якщо такого файлу нема, то він буде створений.

// fs.appendFile(filename, data, [options]) – додавання у файл. Якщо такого файлу нема, то він буде створений.
// filename - абсолютний шлях до файлу з його ім'ям та розширенням
// data - дані, що треба додати до файлу. Наприклад, текст

// fs.rename(oldPath, newPath) – перейменування файлу.
// fs.unlink(path, callback) – видалення файлу.

// ~ CommonJS:
// Імпорт:
const fs = require("fs").promises;
// або:
// const fs = require("fs/promises");

// Експорт:
// module.exports = {value1, function1};

// Можна імпортувати одразу одним рядком
// Замість цього запису:
const { getCurrentMonth } = require("./date");
const currentMonth1 = getCurrentMonth();
console.log("currentMonth1:::", currentMonth1);

// ...можна імпортувати функцію так:
const currentMonth2 = require("./date").getCurrentMonth();
console.log("currentMonth2:::", currentMonth2);

// Рееспорт:
// Спочатку треба все імпортувати, а потім все експортувати одним об'єктом
const obj = require("./users");
const { function1 } = require("./users");
module.exports = { obj, function1 };

// fs.readdir(__dirname).then(files =>
//   Promise.all(
//     files.map(async filename => {
//       const stats = await fs.stat(filename);
//       return {
//         name: filename,
//         size: stats.size,
//         date: stats.date,
//       };
//     }),
//   ).then(result => console.table(result)),
// );

// Раніше, коли не було промісів, то використовували callback. Першим аргументом була помилка, другим - дані файлу у сирому вигляді (Buffer):
fs.readFile("./files/file.txt", (error, data) => {
  console.log(error); // якщо помилки не буде, то тут буде null
  console.log(data); // Buffer
});

// Після появи промісів:
fs.readFile("./files/file.txt")
  .then(data => console.log(data)) // Buffer
  .catch(error => console.log(error.message));

// Використання промісів через асинхронну функцію:
const textFileFunc = async path => {
  try {
    // * Читання файлу
    const buffer = await fs.readFile(path);
    console.log("buffer:::", buffer);
    const data1 = buffer.toString();
    console.log("readFileFn >> data1:::", data1);

    // Другий варіант як отримати текст з файлу - передати другим аргументом кодування (toString() за замовчуванням використовує кодування "utf-8"):
    const data2 = await fs.readFile(path, "utf-8");
    console.log("readFileFn >> data2:::", data2);

    // * Додавання тексту у файл (fs.appendFile(filename, data, [options])):
    const result = fs.appendFile(path, "\nДоданий у файл текст"); // \n додасть текст з нового рядку, а не одразу після існуючого тексту
    console.log("readFileFn >> result:::", result); // у result буде undefined, бо appendFile повертає undefined.

    fs.appendFile("./files/file2.txt", "\nДоданий у файл текст"); // створить неіснуючий досі файл file2.txt

    // * Перезапис файлу (перезапис тексту файлу у цьому прикладі):
    fs.writeFile(path, "Новий текст, що перезапише існуючий");
    fs.writeFile("./files/file3.txt", "Новий текст, що перезапише існуючий"); // створить неіснуючий досі файл file2.txt

    // * Видалення файлу
    fs.unlink("./files/file3.txt"); // видалить файл file3.txt
  } catch (error) {
    console.log("error:::", error.message);
  }
};

textFileFunc("./files/file.txt");

// ~ ECMA Script:
// __dirname: Працює лише в CommonJS.
// У середовищі ES Module змінна __dirname не доступна за замовчуванням, оскільки вона є специфічною для CommonJS

// import.meta.url: Використовується в ES Modules для доступу до URL поточного модуля.
// У ES Modules можна використати import.meta.url, щоб отримати шлях до поточного модуля. Для цього потрібно перетворити URL у шлях до директорії

import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Отримую __filename та __dirname для ES Module

// import.meta.url: Використовується для отримання URL поточного модуля.
// fileURLToPath: Перетворює import.meta.url в абсолютний шлях до файлу.
// path.dirname: Отримує директорію, в якій знаходиться файл.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const fn = async () => {
  const files = await fs.readdir(__dirname);

  const result = await Promise.all(
    files.map(async filename => {
      // const stats = await fs.stat(filename); // відносний шлях до поточної директорії в який запускається файл (файл має знаходитись в правильній директорії, тобто запускатись з того місця де розташований). Це не надійний метод, бо виклик файлу з іншої директорії призведе до помилки.

      // Більш надійний і рекомендований спосіб (файл може бути запущений з будь-якого місця):
      const filePath = path.join(__dirname, filename); // Отримуємо повний шлях до файлу
      const stats = await fs.stat(filePath); // Використовуємо fs.stat для отримання інформації про файл
      return {
        name: filename,
        size: stats.size,
        date: stats.date,
      };
    }),
  );

  console.table(result);
};

fn();
