import { Client, MessageEmbed } from 'discord.js'
import { Signale } from 'signale'
import path from 'path'

import Invoker from './Invoker'
import Parser from './Parser'
import Storage from './Storage'
import getDirectoryFiles from './utils/getDirectoryFiles'
import pick from './utils/pick'
import BadInputException from './exceptions/BadInputException'
import { DiscappConfig, MessageContract } from './types'

export default class Application {
  /**
   * The application config
   */
  private readonly $config: DiscappConfig = {
    commandsDirectory: './src/commands',
    token: '',
    prefix: '',
    hooks: {
      afterCommand: [],
      beforeCommand: [],
    },
  }

  /**
   * Application logger
   */
  private readonly logger = new Signale({
    config: {
      displayTimestamp: true,
    },
  })

  constructor(private readonly $client = new Client()) {}

  /**
   * Start the app with the preferred configs
   *
   * @param config The configuration
   */
  public withConfig(config: Partial<DiscappConfig>) {
    const filteredConfig: Partial<DiscappConfig> = pick(
      config,
      Object.keys(this.$config)
    )

    Object.assign(this.$config, filteredConfig)

    return this
  }

  /**
   * Respond the user input
   *
   * @param channel The channel
   * @param response The response
   */
  private respond(channel: MessageContract['channel'], responses: any) {
    if (Array.isArray(responses)) {
      for (const response of responses) {
        this.respond(channel, response)
      }
    } else {
      if (typeof responses === 'string') {
        channel.send(responses)
      } else {
        channel.send(responses)
      }
    }
  }

  /**
   * Loads the commands
   */
  private loadApp(logger: Signale) {
    const directories = [this.$config.commandsDirectory]

    for (const directory of directories) {
      const dirFiles = getDirectoryFiles(directory)

      for (const file of dirFiles) {
        require(file)
        logger.success('File %s was successfully loaded', path.basename(file))
      }
    }

    return this
  }

  /**
   * Validates all the commands
   */
  private validateCommands(logger: Signale) {
    for (const Command of Storage.getAllCommands()) {
      try {
        Command.validate()
        logger.success(
          'Command %s (%s) is valid and ready',
          Command.name,
          Command.$name
        )
      } catch (error) {
        /**
         * If the command is invalid, removes the command
         * from the Storage and throw a warning
         */
        Storage.removeCommand(Command)
        logger.error(
          'Command %s (%s) is valid and ready',
          Command.name,
          Command.$name
        )
        logger.error(
          `Command ${Command.name} is invalid, so it can't be used by Discapp.`
        )
      }
    }

    return this
  }

  /**
   * Initializes the Discappp
   */
  public bootstrap() {
    const logger = this.logger.scope('bootstrap')

    this.loadApp(logger).validateCommands(logger)

    return this
  }

  /**
   * Handles the user input
   *
   * @param message The message
   */
  private async onInput(message: MessageContract) {
    const { content: originalContent, author, channel } = message
    let content = originalContent

    if (content.startsWith(this.$config.prefix)) {
      content = content.substr(this.$config.prefix.length)
    } else {
      return
    }

    for (const Command of Storage.getAllCommands()) {
      try {
        /**
         * Parse the input for the context
         */
        const parser = new Parser(content).forCommand(Command)

        if (parser.isValid()) {
          const context = parser
            .makeContext(originalContent)
            .setAuthor(author)
            .setChannel(channel)

          /**
           * Invokes the command with its context and
           * stores the response
           */
          const invokerSpecificHooks = {
            afterCommand: this.$config.hooks.afterCommand,
            beforeCommand: this.$config.hooks.beforeCommand,
          }

          const response = await new Invoker(new Command())
            .withHooks(invokerSpecificHooks)
            .withContext(context)
            .invoke()

          /**
           * If the command returns something then send
           * it to the channel
           */
          if (response) {
            this.respond(channel, response)
          }
        }
      } catch (error) {
        if (error instanceof BadInputException) {
          const errorMessage = new MessageEmbed()
            .setTitle('Error: bad input')
            .setDescription(
              'The message does not match the expected command format'
            )
            .addField('Command', error.commandName)
            .addField('Argument', error.argumentName)
            .addField('Error message', error.message)
            .setColor('#ff6e6c')
            .setFooter(Date.now())

          this.respond(channel, errorMessage)
        } else {
          throw error
        }
      }
    }
  }

  /**
   * Ignites the app
   */
  public ignite() {
    const app = this.logger.scope('app')

    /**
     * Once the App is running logs
     */
    this.$client.once('ready', () => {
      app.success('Discapp is running')
    })

    /**
     * Delegates the message input to the onInput function
     */
    this.$client.on('message', message => {
      this.onInput(message)
    })

    /**
     * Logins into the Discord
     */
    this.$client.login(this.$config.token)
  }
}
