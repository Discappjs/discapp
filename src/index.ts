import 'reflect-metadata'

/**
 * Application
 */
export { default as Application } from './Application'

/**
 * Discapp Internal
 */
export { default as CommandContext } from './CommandContext'
export { default as BaseCommand } from './BaseCommand'
export { default as Storage } from './Storage'
export { default as Parser } from './Parser'
export { default as Invoker } from './Invoker'

/**
 * Utilitary
 */
export * from './Collections'

/**
 * Types and interfaces
 */
export { default as ApplicationContract } from './Application/ApplicationContract'
export { default as CommandContextContract } from './CommandContext/CommandContextContract'
export { default as StaticCommandContract } from './BaseCommand/StaticCommandContract'
export { default as CommandContract } from './BaseCommand/CommandContract'
export { default as ParserContract } from './Parser/ParserContract'
export { default as InvokerContract } from './Invoker/InvokerContract'
export * from './types'

/**
 * Decorators
 */
export { default as Command } from './Decorators/Command'
export { default as Argument } from './Decorators/Argument'
export * from './Decorators/associations'

/**
 * Exceptions
 */
export { default as BadInputException } from './Exceptions/BadInputException'
export { default as InvalidArgumentException } from './Exceptions/InvalidArgumentException'
