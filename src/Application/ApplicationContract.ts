import { Client } from 'discord.js'
import { Signale } from 'signale'

import { DiscappConfig } from '../types'

export default interface ApplicationContract {
  start(): this
  getClient(): Client
  getLogger(): Signale
  getConfig(): DiscappConfig
}
