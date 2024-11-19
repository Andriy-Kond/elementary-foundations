// https://www.npmjs.com/package/commander
// https://www.npmjs.com/package/colors

// Для інтерактивного введення в консолі (питання-відповідь) можна використати стандартний модуль Node.js readline.
import readline from "readline";

// в опціях передаються потоки введення та виведення, консоль, файл тощо.
// В цьому прикладі використовуються стандартні потоки та взаємодія в консолі, де запускається скрипт:

import { program } from "commander";
import colors from "colors";

// const fs = require("fs").promises;
import { promises as fs } from "fs";
// fs.readFile(filename, [options]) – читання файлу
// fs.writeFile(filename, data, [options]) – запис файлу
// fs.appendFile(filename, data, [options]) – додавання у файл
// fs.rename(oldPath, newPath) – перейменування файлу.
// fs.unlink(path, callback) – видалення файлу.

program.option(
  "-f, --file [type]", // визначення запуску програми у вигляді: node consoleApp.js -f my_log.txt
  "file for saving game results",
  "results.txt", // водночас вказую третім параметром у program.option, що якщо параметр -f не буде переданий у запуску, то за замовчуванням program.file буде дорівнювати results.txt
);

program.parse(process.argv);

const rl = readline.createInterface({
  input: process.stdin, // введення зі стандартного потоку
  output: process.stdout, // виведення у стандартний потік
});

let count = 0; // кількість спроб
const logFileName = program.opts().file; // logFile – ім'я файлу, куди будуть збережені результати гри
const mind = Math.floor(Math.random() * 10) + 1; // загадане число

const isValid = value => {
  if (isNaN(value)) {
    console.log("Це виглядає як рядок. Введіть число.".red);
    return false;
  }

  if (value < 1 || value > 10) {
    console.log("Число має бути в діапазоні від 1 до 10".red);
    return false;
  }

  if (!Number.isInteger(value)) {
    console.log("Число має бути ціле, а не дробне".red);
    return false;
  }

  return true;
};

const createLogFile = async data => {
  try {
    await fs.appendFile(logFileName, `${data}\n`);
    console.log(`Вдалося зберегти результат у файл ${logFileName}`.green);
  } catch (err) {
    console.log(`Не вдалося зберегти файл ${logFileName}`.red);
  }
};

const game = () => {
  rl.question(
    "Введіть ціле число від 1 до 10, щоб вгадати задумане: ".yellow,
    value => {
      let a = +value;
      if (!isValid(a)) {
        game();
        return;
      }

      count += 1;

      if (a === mind) {
        console.log("Вітаю, Ви вгадали число за %d крок(ів)".green, count);

        createLogFile(
          `${new Date().toLocaleDateString()}: Вітаю, Ви вгадали число за ${count} крок(ів)`,
        ).finally(() => rl.close());

        return;
      }

      console.log("Ви не вгадали, ще спроба".red);
      game();
    },
  );
};

game();
