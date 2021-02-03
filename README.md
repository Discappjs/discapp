<p align="center">
  <img src=".github/logo.svg" width="250">
</p>

<h3 align="center">
  Build Discord applications with ease.
</h3>

<br/><br/>

## Introduction

Discapp is a Node.js framework for rapidly building Discord applications by using modern JavaScript and TypeScript features.

Discapp comes with:

- Out-of-the-box command routing, powered by decorators
- Input analysis and automatic command's argument attribution
- Straightforward, simple structure
- Extensible API

## Getting started

Clone the [Discapp demo repository](https://github.com/jotaajunior/discapp-demo);

```bash
npx degit jotaajunior/discapp-demo#main
```

Clone `.env.example` to `.env`; replace the value of `DISCORD_TOKEN` with your own token.

```
DISCORD_TOKEN=YOUR_TOKEN_HERE
```

Make sure to already have your bot connected to some server, then install the dependencies:

```bash
yarn install
```

That's all, your demo is ready to go:

```
yarn dev
```

The script above will run your application in development mode, with command hot-reloading. You cant test if the application is running by sending:

```
!ping
```

In the Discord server you have configured your bot.

## Writing your first command

### Basic concepts

In Discapp, every command is represented by a single entity that is responsible for handle the input and return an output.

Every command has a **code**, this code is the identifier of a command and must be unique among the commands, pretty much like a person anme.

In addition, every command may have **arguments**. Arguments are additional information that is passed to the command.

In this tutorial we will be covering the creation of a command — the `random` command — that takes two arguments:

- `min` the smallest possible value
- `max` the biggest possible value

And outputs a random integer value between `min` and `max`.

### Discapp flux

Every message sent by the user is analyzed and handled by Discapp, that invokes the responsible command entity (if it exists). For example, given the user message:

```
!random 5 10
```

Discapp will analyze the input, first dividing it in parts (`random`, `5`, `10`) The first part is assumed to be the **code** of the command, while the remaining parts are assumed to be the **arguments**.

The table bellow may help you understand better:

<div align="center">

| Input                            | Prefix | Code        | Arguments                      |
| -------------------------------- | ------ | ----------- | ------------------------------ |
| `!random 5 10`                   | `!`    | `random`    | `5`, `10`                      |
| `!command 10 5 4 3`              | `!`    | `command`   | `10`, `5`, `4`, `3`            |
| `!convert 1 BRL USD`             | `!`    | `convert`   | `1`, `BRL`, `USD`              |
| `!help`                          | `!`    | `help`      |                                |
| `!translate en pt "Hello World"` | `!`    | `translate` | `en`, `pt`, `"Hello`, `World"` |

</div>

### Declaring the command

Let's start by creating the file that will hold our command implementation. In Discapp, commands have a special directory (by default: `path/to/your/app/commands`), we recommend you to always put your commands there, as they're loaded by default by Discapp.

Create the file `RandomCommand.ts` in your app `commands` directory. Then, let's start by writing our command basic definition:

```ts
import { Command, BaseCommand } from 'discapp'

@Command('random')
export class RandomCommand extends BaseCommand {}
```

Notice a couple of things here:

1. The `@Command('random')` part is telling Discapp that the class bellow is a command, and its code `random`.
2. Every command should extends the class `BaseCommand` coming from Discapp.

### Declaring the command arguments

Once you declared your command, the next step is to define the command arguments, if it's necessary. As we defined previouly, our command will take two arguments `min` and `max`, so lets define them:

```ts
import { Command, BaseCommand, Argument } from 'discapp'

@Command('random')
export class RandomCommand extends BaseCommand {
  @Argument()
  public min: number

  @Argument()
  public max: number
}
```

See that declaring an argument is as simple as declaring a class property and annotate it with the `@Argument()` decorator. This tells Discapp that the following property should map to an argument.

Notice that the argument decorator don't need to receive any information, the arguments will be resolved in their order they were declared. So, the first argument of the user input will be `min`, and the second will be `max`. The table bellow shows how the arguments are assigned:

<div align="center">

| Input           | min  | max  |
| --------------- | ---- | ---- |
| `!random 5 10`  | `5`  | `10` |
| `!random 10 5`  | `10` | `5`  |
| `!random 54 33` | `54` | `33` |

</div>

### Finishing the command

In order to be complete our command must have an public `execute` method that will respond to the user input, in our case it'll return a random number between `min` and `max`.

Lets write the `execute` method:

```ts
import { Command, BaseCommand, Argument } from 'discapp'

@Command('random')
export class RandomCommand extends BaseCommand {
  @Argument()
  public min: number

  @Argument()
  public max: number

  public execute() {
    const random = Math.floor(Math.random() * (this.max - this.min)) + this.min

    return random
  }
}
```

And that's all. If you're running Discapp in development mode you should already be able to executing the `random` command, try it out by sending: ´!random 10 50`.

### Play

There's still a lot of unexplored, uncovered and yet to come Discapp features. For the sake of simplicity they were omitted from this tutorial, but will be covered in t he future documentation.

<p align="center">
  <sub>Built with ❤︎ by <a href="https://github.com/jotaajunior">Jota</a></sub>
</p>
