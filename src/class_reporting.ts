import * as $error from './func_error.ts'
import { TEAMS_WEB_HOOK } from './func_webhook.ts'
import { ExtensionSystemTypes as Type } from './types.d.ts'

/**
 * @variable Report Constant
 * @description Report implementation with generic
 */
export const reports: Type.ReportType<unknown> = {
  notifications: {},
  entries: {},
}

/**
 * @function notifyTeamsHook
 * @description Sends a notification to Microsoft Teams using a TEAMS_WEB_HOOK URL.
 * @param message - The message to be sent to Teams Hook URL via POST.
 * @returns responseText - The response object text from the TEAMS_WEB_HOOK promise response
 */
export async function notifyTeamsHook(
  message: string,
): Promise<string | boolean> {
  $error.logErrorWithType(
    `Attempted Teams Webhook Message: ${message}`,
    '',
    'brightBlue',
    `${$error.tabstop.t4} ╰─── NOTICE	┈ HOOK	┈ `,
  )
  if (typeof TEAMS_WEB_HOOK === 'string' && TEAMS_WEB_HOOK.length > 0) {
    const response = await fetch(TEAMS_WEB_HOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        {
          type: 'message',
          attachments: [
            {
              contentType: 'application/vnd.microsoft.card.adaptive',
              contentUrl: null,
              content: {
                '$schema': 'http://adaptivecards.io/schemas/adaptive-card.json',
                'type': 'AdaptiveCard',
                'version': '1.2',
                'msteams': {
                  'width': 'Full',
                },
                'body': [
                  {
                    'type': 'TextBlock',
                    'text': message,
                    'wrap': true,
                  },
                ],
              },
            },
          ],
        },
      ),
    })
    const responseText = await response.text()
    return responseText
  } else return false
}

/**
 * @class Reporting
 * @description Reporting class that loads json and perists state using observer pattern.
 * It allows registering hooks that can be triggered when a new report entry is added.
 * The hooks can be used to send notifications, log errors, or perform any other actions
 */
export class Reporting<T> {
  private aggregate: { repos: Record<string, T[]> } = { repos: {} }
  private hooks: Array<(entry: Type.GenericReportEntry<T>) => Promise<void>> =
    []
  private writeLock: Promise<void> = Promise.resolve()

  constructor(private outputFile: string = 'report_aggregate.json') {}

  // Register a new async hook (e.g., notifyTeams, custom webhooks, etc.)
  registerHook(hook: (entry: Type.GenericReportEntry<T>) => Promise<void>) {
    this.hooks.push(hook)
  }

  // Add a report entry and trigger hooks
  async addEntry(
    name: string,
    entry: Type.GenericReportEntry<T>,
  ): Promise<void> {
    if (!this.aggregate.repos[entry.repo]) {
      this.aggregate.repos[entry.repo] = []
    }

    (this.aggregate as Type.ReportEntries<Type.GenericReportEntry<T>>)
      .repos[entry.repo].push(entry)

    // Trigger all hooks asynchronously (do not block on errors)
    await Promise.all(
      this.hooks.map(async (hook) => {
        try {
          $error.logErrorWithType(
            `Attempting to add hook: `,
            entry,
            'gray',
            `${$error.tabstop.t4} ╰─── NOTICE	┈ ADD HOOK TO REPORT	┈ `,
          )
          await hook(entry)
        } catch (e) {
          $error.logErrorWithType(
            `Could not add Hook to map: ${e}`,
            entry,
            'red',
            `${$error.tabstop.t4} ╰─── ERROR	┈ ADD HOOK TO REPORT	┈ `,
          )
        }
      }),
    )

    // Persist the repo-specific report to a temporary file
    await this.saveRepo(entry.repo)
  }

  // Save each repo's data to a temporary JSON file
  private async saveRepo(repo: string) {
    const tempFile = `${repo}.tmp.json`
    const repoData = this.aggregate.repos[repo]
    if (!repoData) {
      console.error(`No data found for repo: ${repo}. Skipping save.`)
      return
    }

    this.writeLock = this.writeLock.then(async () => {
      await Deno.writeTextFile(tempFile, JSON.stringify(repoData, null, 2))
      console.log(`Saved temporary file for repo: ${repo}`)
    })
    await this.writeLock
  }

  // Combine all temporary files into the final aggregate report
  static async combineReports(filename: string = 'report_aggregate.json') {
    const combinedData: { repos: Record<string, unknown[]> } = { repos: {} }
    // needs to loop through all temporary files and push each object into the appropriate repo key
    const tempFiles = Array.from(Deno.readDirSync('.'))
      .filter((file) => file.name.endsWith('.tmp.json'))
      .map((file) => file.name)
    console.log(tempFiles)
    if (tempFiles.length === 0) {
      console.warn('No temporary report files found to combine.')
      return
    }
    // Since 'aggregate' is not available statically, loop through tempFiles instead
    for (const tempFile of tempFiles) {
      const repo = tempFile.replace('.tmp.json', '')
      try {
        const data = await Deno.readTextFile(tempFile)
        combinedData.repos[repo] = JSON.parse(data)
      } catch (error) {
        if (error && typeof error === 'object' && 'message' in error) {
          console.error(
            `Failed to read temporary file for repo: ${repo}. Error: ${
              (error as { message: string }).message
            }`,
          )
        } else {
          console.error(
            `Failed to read temporary file for repo: ${repo}. Error:`,
            error,
          )
        }
      }
    }

    // Write the combined data to the final output file
    const finalTempFile = `${filename}.tmp`
    await Deno.writeTextFile(
      finalTempFile,
      JSON.stringify(combinedData, null, 2),
    )
    await Deno.rename(finalTempFile, filename)
    console.log(
      `Combined all repo data into final report: ${filename}`,
    )
  }

  // Optionally, load an existing report file
  async load() {
    try {
      const data = await Deno.readTextFile(this.outputFile)
      this.aggregate = JSON.parse(data)
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        // File doesn't exist, start fresh
        this.aggregate = { repos: {} }
      } else {
        if (error && typeof error === 'object' && 'message' in error) {
          console.error(
            `Failed to load report file: ${
              (error as { message: string }).message
            }`,
          )
        } else {
          console.error('Failed to load report file:', error)
        }
        throw error
      }
    }
  }
}

/**
 * @function createReport
 * @description Creates a new Reporting instance, registers hooks, and loads the report data.
 * @param hooks - An array of hooks to be registered with the Reporting instance.
 * @param outputFile - The file where the aggregate report will be saved.
 * @returns A promise that resolves to the Reporting instance.
 */
export async function createReport<
  T = unknown,
>(
  hooks: Array<(entry: Type.GenericReportEntry<T>) => Promise<void>> = [],
  outputFile: string = 'report_aggregate.json',
): Promise<Reporting<T>> {
  const reporting = new Reporting<T>(outputFile)
  for (const hook of hooks) {
    reporting.registerHook(hook)
  }
  await reporting.load()
  return reporting
}

/**
 * @function createReportEntry
 * @description Creates a new report entry using GenericReportEntry or any extended interfaces using it as a base.
 * @param entry - The report entry to be created.
 */
export function createReportEntry<T extends Type.GenericReportEntry<any>>(
  entry: T,
): T {
  return entry
}
