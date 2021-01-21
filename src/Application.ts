import { Client } from 'discord.js'

import Invoker from './Invoker'
import Parser from './Parser'
import { storage } from './Storage'
import getDirectoryFiles from './utils/getDirectoryFiles'
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
   *
   * TODO: Load listeners
   */
  private loadApp() {
    const directories = ['./src/commands']

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
    let { content, author, channel } = message

    if (content.startsWith(this.$config.prefix)) {
      content = content.substr(this.$config.prefix.length)
    } else {
      return
    }

    for (const command of storage.getAllCommands()) {
      /**
       * Parse the input for the context
       */
      const parser = new Parser(content).forCommand(command)

      try {
        /**
         * Check if the input matches the command. If not, skips
         * and tests for the next command.
         *
         * If matches, but is not valid (e.g: Missing argument) then
         * a error will be throwed.
         */
        const isValid = parser.isValid()

        if (isValid) {
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

          const response = await new Invoker(command)
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
        } else {
          continue
        }
      } catch (error) {
        console.log(error.message)
      }
    }
  }

  /**
   * Ignites the app
   */
  public ignite() {
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
