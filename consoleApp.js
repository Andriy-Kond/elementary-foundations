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

// Налаштування readline для того, щоб спілкуватись з командним рядком:
const rl = readline.createInterface({
  input: process.stdin, // введення зі стандартного потоку
  output: process.stdout, // виведення у стандартний потік
});

// Один .option() на один аргумент. Якщо треба ще один аргумент, то треба написати ще один .option()
program.option(
  "-f, --fileName <type>", // визначення запуску програми у вигляді: node consoleApp -f superLog.txt (можна ще робити інші дужки - [type], але тоді не буде підказки, якщо ввести рядок без вказування імені файлу (node consoleApp -f) - просто при збереженні результату видасть помилку про невдале збереження результату). Якщо ж написати "<type>", то видасть попередження: "error: option '-f, --file <type>' argument missing"
  "file for saving game results", // коментар до файлу
  "game_results.txt", // ім'я файлу. якщо параметр -f не буде переданий у запуску, то за замовчуванням program.file буде дорівнювати results.txt
);
program.parse(process.argv); // розпарсити передані аргументи - бере з командного рядку передані мною опції і обробляє їх.

// // .on() - це як event listener у React
// // line - це подія, яка означає, що прийшов якийсь новий рядок (новий ввід)
// rl.on("line", txt => {
//   console.log(`You have entered ${txt}!`);

//   process.exit(); // завершує діалог
// });

// =========== Game ==============
let count = 0; // кількість спроб (counter of user attempts)

const mind = Math.ceil(Math.random() * 10); // загадане число (guessed number)
// або: Math.floor(Math.random() * 10) + 1;)
// Math.random() - повертає випадкове число від 0 до 1: 0.135456482, 0.78948341532484
// ceil - округлення у бік збільшення: 1.35, 8.75 => 2, 9
// floor - округлення у бік зменшення: 1.35, 8.75 => 1, 8
// round - округлення до найближчого: 5.95, 5.5, 5.05 => 6, 6, 5; -5.05, -5.5, -5.95 => -5, -5, -6

const logFileName = program.opts().fileName; // logFileName – файл, куди будуть збережені результати гри. .fileName - це назва того файлу, що вказується в аргументі --fileName (-f). Ім'я змінної має збігатись, тобто --fileName та program.opts().fileName.

// Input value validator
const isValid = value => {
  // Number.isNaN(value) === isNaN(value)
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

// Всі асинхронні функції треба загортати у try...catch
const logger = async data => {
  try {
    await fs.appendFile(logFileName, `${data}\n`); // записуємо дані (data) у файл

    console.log(
      `Вдалося зберегти результат у файл ${logFileName} (Successfully game result to game log file ${logFileName})`
        .green,
    );
  } catch (err) {
    console.log(
      `Не вдалося зберегти файл ${logFileName}. Something went wrong: ${err.message}`
        .red,
    );
  }
};

const game = () => {
  // .question() - це як інтерактивний promt у браузері
  rl.question(
    "Введіть ціле число від 1 до 10, щоб вгадати задумане:\n".yellow,
    value => {
      let number = +value; // Number(value)

      // validation
      if (!isValid(number)) {
        game();
        return;
      }
      count += 1;

      if (number === mind) {
        console.log("Вітаю, Ви вгадали число за %d крок(ів)".green, count);

        logger(
          `${new Date().toLocaleString(
            "uk-UA",
          )}: Вітаю, Ви вгадали число за ${count} крок(ів)`,
        );
        // Можна або додати до logger .finally:
        // .finally(() => rl.close());
        // або просто поставити .close():
        rl.close();
        return;
      }

      console.log("Ви не вгадали, ще спроба".red);
      game();
    },
  );
};

game();
