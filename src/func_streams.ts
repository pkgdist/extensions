import {
  Level,
  levelToName,
  Logger,
  nameToLevel,
} from "jsr:@onjara/optic/logger";
import { JsonFormatter } from "jsr:@onjara/optic/formatters";
import { PropertyRedaction } from "jsr:@onjara/optic/transformers";
import {
  every,
  FileStream,
  of,
} from "https://deno.land/x/optic@2.0.1/streams/fileStream/fileStream.ts";

  // log level generics
  export enum LevDev {
    Trace = "Trace",
    Debug = "Debug",
    Info = "Info",
    Warn = "Warn",
    Error = "Error",
    Critical = "Critical",
  }
import type { ExtensionSystemTypes as Types } from "./types.d.ts"; // Only works if it's exported as a type, not a namespace
const logLevelDefault: Types.LogLev = LevDev.Info;
const logToDebug = await streamInit("debug.log", logLevelDefault);
const logToReport = await streamInit("report.log", logLevelDefault);

/**
 * @function streamInit
 * @description Initializes a logger stream with specified configurations.
 * @param name [string] The name of the log file.
 * @param specifiedLevel
 * @returns logger new file stream object
 */
async function streamInit(
  name: string,
  specifiedLevel: string = "Trace",
) {
  const stream = new FileStream(name)
    .withMinLogLevel(nameToLevel(specifiedLevel))
    .withFormat(
      new JsonFormatter()
        .withPrettyPrintIndentation(2)
        .withDateTimeFormat("YYYY.MM.DD hh:mm:ss:SSS"),
    )
    .withBufferSize(10000)
    .withLogFileInitMode("append")
    .withLogFileRotation(
      every(200000).bytes().withLogFileRetentionPolicy(of(7).days()),
    )
    .withLogHeader(false)
    .withLogFooter(false);

  return new Logger()
    .withMinLogLevel(nameToLevel(specifiedLevel))
    //.addFilter((_stream: Stream, logRecord: LogRecord) => logRecord.msg === "debug")
    .addTransformer(new PropertyRedaction("password"))
    .addTransformer(new PropertyRedaction("GH_TOKEN"))
    .addTransformer(new PropertyRedaction("token"))
    .addStream(stream);
}

export {
  every,
  FileStream,
  JsonFormatter,
  Level,
  levelToName,
  Logger,
  logLevelDefault,
  logToDebug,
  logToReport,
  nameToLevel,
  of,
  PropertyRedaction,
  streamInit,
};
