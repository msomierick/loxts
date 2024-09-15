#!/usr/bin/env node

import chalk from "chalk";
import * as fs from "fs";
import readline from "readline";
import Scanner from "./Scanner.js";
import Token from "./Token.js";
import TokenType from "./TokenType.js";
import Parser from "./Parser.js";
import { Expr } from "./Expr.js";
import { AstPrinter } from "./AstPrinter.js";

const success = chalk.bold.green;
const error = chalk.bold.red;
const info = chalk.yellow;
const warning = chalk.hex("#FFA500"); // Orange color

export default class Lox {
  private static hadError: boolean = false;

  static main(): void {
    const args = process.argv.slice(2);

    if (args.length > 1) {
      console.log(warning("Usage: node lox.mjs [script]"));
      process.exit(64);
    } else if (args.length === 1) {
      Lox.runFile(args[0]);
    } else {
      Lox.runPrompt();
    }
  }

  private static runFile(filePath: string): void {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error(error(`Error reading file ${filePath}: ${err.message}`));
        process.exit(1);
      }
      Lox.run(data);
      if (Lox.hadError) {
        process.exit(65);
      }
    });
  }

  private static runPrompt(): void {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log(info("Enter some input (Ctrl+C to exit):"));

    rl.on("line", (input: string) => {
      Lox.run(input);
      Lox.hadError = false;
    });
  }

  private static run(source: string): void {
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();

    // for (const token of tokens) {
    //   console.log(success(token));
    // }

    const parser: Parser = new Parser(tokens);
    const expression: Expr | null = parser.parse();

    if (this.hadError || !expression) {
      return;
    }

    const astPrinter: AstPrinter = new AstPrinter();
    console.log(success(astPrinter.print(expression)));
  }

  static error(place: number | Token, message: string): void {
    if (typeof place == "number") {
      Lox.report(place, "", message);
    }
    if (place instanceof Token) {
      if (place.type == TokenType.EOF) {
        Lox.report(place.line, " at end", message);
      } else {
        Lox.report(place.line, " at '" + place.lexeme + "'", message);
      }
    }
  }

  private static report(line: number, where: string, message: string): void {
    console.log(error(`[line ${line}] Error${where}: ${message}`));
    Lox.hadError = true;
  }
}

// Execute the main function when the module is run directly
if (import.meta.url === new URL(import.meta.url).href) {
  Lox.main();
}
