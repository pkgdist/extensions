// Copyright 2020-2024 the optic authors. All rights reserved. MIT license.
import { BaseStream } from '../baseStream.ts'
import { type LogMeta, type LogRecord, ValidationError } from '../../types.ts'
import { TokenReplacer } from '../../formatters/tokenReplacer.ts'
import { Level } from '../../logger/levels.ts'
import type { LogFileInitStrategy, RotationStrategy } from './types.ts'
import type { TimeInterval } from '../../utils/timeInterval.ts'
import { SyncBufferedFileWriter } from './syncBufferedFileWriter.ts'

export type { LogFileInitStrategy } from './types.ts'
export { DateTimeRotationStrategy } from './dateTimeRotationStrategy.ts'
export { FileSizeRotationStrategy } from './fileSizeRotationStrategy.ts'
export { of } from './retentionPolicy.ts'
export { every } from './rotationStrategy.ts'

/**
 * A stream for log messages to go to a file.  You may also configure the following:
 * * Max buffer size (default 8192 bytes)
 * * Log file rotation strategy (default none)
 * * Log file retention policy (default none)
 * * Log file initialization strategy (default "append")
 */
export class FileStream extends BaseStream {
  #filename: string
  #rotationStrategy: RotationStrategy | undefined = undefined
  #logFileInitStrategy: LogFileInitStrategy = 'append'
  #maxBufferSize = 8192
  #buffer!: SyncBufferedFileWriter
  #logFile!: Deno.FsFile
  #deferredLogQueue: LogRecord[] = []
  #encoder = new TextEncoder()
  #autoFlushId = -1

  constructor(filename: string) {
    super(new TokenReplacer())
    this.#filename = filename
  }

  override setup(): void {
    super.setup()

    if (this.#rotationStrategy !== undefined) {
      this.#rotationStrategy.initLogs(
        this.#filename,
        this.#logFileInitStrategy,
      )
    }

    const openOptions = {
      createNew: this.#logFileInitStrategy === 'mustNotExist',
      create: this.#logFileInitStrategy !== 'mustNotExist',
      append: this.#logFileInitStrategy === 'append',
      truncate: this.#logFileInitStrategy !== 'append',
      write: true,
    }
    this.#logFile = Deno.openSync(this.#filename, openOptions)
    this.#buffer = new SyncBufferedFileWriter(
      this.#logFile,
      this.#maxBufferSize,
    )
  }

  override destroy(): void {
    this.flush()
    if (this.#autoFlushId !== -1) {
      clearInterval(this.#autoFlushId)
    }
    super.destroy()
    this.#buffer.close()
    this.#logFile.close()
  }

  override logHeader(meta: LogMeta): void {
    if (!this.outputHeader) return
    super.logHeader(meta)
  }

  override logFooter(meta: LogMeta): void {
    if (!this.outputFooter) return
    this.flush()
    super.logFooter(meta)
  }

  override handle(logRecord: LogRecord): boolean {
    if (this.minLogLevel > logRecord.level) return false

    if (logRecord.level > Level.Error) {
      this.#deferredLogQueue.push(logRecord)
      this.processDeferredQueue()
      this.flush()
    } else {
      if (this.#deferredLogQueue.length === 0) {
        queueMicrotask(() => {
          this.processDeferredQueue()
        })
      }
      this.#deferredLogQueue.push(logRecord)
    }
    return true
  }

  private processDeferredQueue() {
    for (let i = 0; i < this.#deferredLogQueue.length; i++) {
      const msg = this.format(this.#deferredLogQueue[i])
      this.log(msg)
    }
    this.#deferredLogQueue = []
  }

  log(msg: string): void {
    const encodedMsg = this.#encoder.encode(msg + '\n')
    if (this.#rotationStrategy?.shouldRotate(encodedMsg)) {
      this.#buffer.flush()
      this.#logFile.close()
      this.#rotationStrategy.rotate(this.#filename, encodedMsg)
      this.#logFile = Deno.openSync(
        this.#filename,
        { createNew: true, write: true },
      )
      this.#buffer = new SyncBufferedFileWriter(
        this.#logFile,
        this.#maxBufferSize,
      )
    }
    this.#buffer.write(encodedMsg)
  }

  /** Force a flush of the log buffer */
  flush(): void {
    if (this.#deferredLogQueue.length > 0) {
      this.processDeferredQueue()
    }
    this.#buffer.flush()
  }

  /** The strategy to use for rotating log files. Examples:
   * ```ts
   * withLogFileRotation(every(20000).bytes())
   * withLogFileRotation(every(7).days())
   * withLogFileRotation(every(12).hours())
   * withLogFileRotation(every(90).minutes())
   * ```
   * Default is no strategy and a single log file will grow without constraint.
   */
  withLogFileRotation(strategy: RotationStrategy): this {
    this.#rotationStrategy = strategy
    return this
  }

  /** The maximum size in bytes of the buffer storage before it is flushed (default is 8192, e.g. 8kb)*/
  withBufferSize(bytes: number): this {
    if (bytes < 0) {
      throw new ValidationError('Buffer size cannot be negative')
    }
    this.#maxBufferSize = bytes
    return this
  }

  /** Automatically flush the log buffer every `amount` of time. Examples:
   * ```ts
   * withAutoFlushEvery(intervalOf(5).seconds())
   * withAutoFlushEvery(intervalOf(4).minutes())
   * withAutoFlushEvery(intervalOf(3).hours())
   * withAutoFlushEvery(intervalOf(2).days())
   * ```
   */
  withAutoFlushEvery(amount: TimeInterval): this {
    if (this.#autoFlushId !== -1) {
      clearInterval(this.#autoFlushId)
    }

    this.#autoFlushId = setInterval(() => {
      this.flush()
    }, amount.getPeriod() * 1000)

    Deno.unrefTimer(this.#autoFlushId)

    return this
  }

  /** The strategy to take when initializing logs:
   * * `"append"` - Reuse log file if it exists, create otherwise
   * * `"overwrite"` - Always start with an empty log file, overwriting any existing one
   * * `"mustNotExist"` - Always start with an empty log file, but throw an error if it
   * already exists
   */
  withLogFileInitMode(mode: LogFileInitStrategy): this {
    this.#logFileInitStrategy = mode
    return this
  }

  /** Returns the filename associated with this stream */
  getFileName(): string {
    return this.#filename
  }

  protected _buffer(): SyncBufferedFileWriter {
    return this.#buffer
  }
}
