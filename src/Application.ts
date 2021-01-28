import { Client, MessageEmbed } from 'discord.js'

import Invoker from './Invoker'
import Parser from './Parser'
import Storage from './Storage'
import getDirectoryFiles from './utils/getDirectoryFiles'
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

  constructor(private readonly $client = new Client()) {}

  /**
   * Start the app with the preferred configs
   *
   * @param config The configuration
   */
  public withConfig(config: Partial<DiscappConfig>) {
    Object.assign(this.$config, config)

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
  private loadApp() {
    const directories = [this.$config.commandsDirectory]

    for (const directory of directories) {
      const commands = getDirectoryFiles(directory)

      for (const command of commands) {
        require(command)
      }
    }

    return this
  }

  /**
   * Initializes the Discappp
   */
  public bootstrap() {
    this.loadApp()

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
            .getContext()
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
   * Validates all the commands
   */
  private verifyCommands() {
    for (const Command of Storage.getAllCommands()) {
      Command.validate()
    }
  }

  /**
   * Ignites the app
   */
  public ignite() {
    this.verifyCommands()

    /**
     * Once the App is running logs
     */
    this.$client.once('ready', () => {
      console.log('Running')
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
