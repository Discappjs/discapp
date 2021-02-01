import { Client } from 'discord.js'
import { Signale } from 'signale'

export default interface ApplicationContract {
  start(): this
  getClient(): Client
  getLogger(): Signale
}
