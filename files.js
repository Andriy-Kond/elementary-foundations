// ^ ES Module ("type": "module" у package.json):

// ~ CommonJS:
// const fs = require("fs").promises;

// import fs from "fs";

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
