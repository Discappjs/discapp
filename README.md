<p align="center">
  <img src=".github/logo.svg" width="250">
</p>

<h3 align="center">
  Build Discord applications (🤖) with ease.
</h3>

<p align="center">
  Develop Discord.js applications with the power of TypeScript.
</p>

<p align="center">
  🚧 Under development, not ready for usage 🚧
</p>

<br/><br/>

## Introduction

Discapp is a Node.js framework for rapidly building Discord applications (aka bots). We're using [Discord.js](https://github.com/discordjs/discord.js).

## Getting started

Clone the demo repository:

```bash
npx degit jotaajunior/discapp-demo
```

Clone `.env.example` to `.env` and insert your Discord token. Then run:

```bash
yarn install
```

This will install all the Discapp dependencies. After that your app is ready to run:

```bash
yarn start
```

You can test if the command is working by sending ping in the Discord server your bot is configureed.

## Example usage

Create the file: `GreetCommand.ts` in your commands directory, usually: `./src/commands`:

```ts
import { Command, Argument, BaseCommand } from 'discapp'

@Command('greet')
export default class GreetCommand extends BaseCommand {
  @Argument()
  public name!: string

  public execute() {
    return `Hello, ${this.name}`
  }
}
```

Make sure to restart the server after adding the command. Now, by sending `greet Jota`, your bot should respond with: `Hello, Jota`.
