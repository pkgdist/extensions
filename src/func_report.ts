import { ExtensionSystemTypes as Type } from "./types.d.ts";
import { logColor } from "./declare_const.ts";
import { logToReport } from "./func_streams.ts";
import { TEAMS_WEB_HOOK } from "./func_webhook.ts";
import * as $error from "./func_error.ts";

/**
 * @function notifyTeams
 * @description Sends a notification to Microsoft Teams using a TEAMS_WEB_HOOK URL.
 * @param message - The message to be sent to Teams Hook URL via POST.
 * @returns responseText - The response object text from the TEAMS_WEB_HOOK promise response
 */
export async function notifyTeams(message: string): Promise<string | boolean> {
  $error.logErrorWithType(
      `Attempted Teams Webhook Message: ${message}`,
      '', 'brightBlue', '                ╰─── '
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
                "$schema":"http://adaptivecards.io/schemas/adaptive-card.json",
                "type":"AdaptiveCard",
                "version":"1.2",
                "body":[
                    {
                    "type": "TextBlock",
                    "text": message
                    }
                ]
              }
            }
          ]
        }
      ),
    })
    const responseText = await response.text()
    return responseText
  } else return false
}

/**
 * @function report
 * @description Reports the result of a rule execution.
 * @param data - Type.Report - The report data containing the score, id, message, path, type, and notification flag.
 * @returns response - Promise<Type.NotificationSuccessResponseInterface | Type.NotificationFailureResponseInterface> - The response object indicating success or failure of the notification.
 */
export async function report(
  data: Type.Report,
): Promise<
  | Type.NotificationSuccessResponseInterface
  | Type.NotificationFailureResponseInterface
  | undefined
> {
  const message =
    `Score: ${data.score} | ${data.id}: ${data.msg} for ${data.path} for type: ${data.type} with notification: ${data.notify} `;
  logToReport.warn("cyan", message);
  $error.logErrorWithType(
    `${message}`,
    "",
    "gray",
    `\n            ╰─── `,
  );

  // logic for optional notifications
  if (data.notify == "teams1") {
    const result = await notifyTeams(
      `${data.id}: ${data.msg} for ${data.path}`,
    );
    if (result) {
      $error.logErrorWithType(
        `${result}`,
        "",
        "gray",
        "                    ╰─── ",
      );
      const response: Type.NotificationSuccessResponseInterface = {
        teams1: {
          notified: () => {
            logColor(
              "green",
              `[INFO] [TEAMS1] for ${data.id}: ${data.msg}`,
            );
          },
        },
      };
      return response;
    } else {
      $error.logErrorWithType(
        `Notification failed for ${data.id}`,
        { type: "debug" },
        "red",
        "        ╰─── WARN	┈ TEAMS	┈ ",
      );
      const failureResponse: Type.NotificationFailureResponseInterface = {
        none: {
          notified: () => {
            logColor(
              "red",
              `[WARN] [NOTIFICATION] Notification failed for ${data.id}`,
            );
          },
        },
      };
      return failureResponse;
    }
  }
  // Default return if no notification is sent
  return {
    none: {
      notified: () => {
        logColor(
          "red",
          `[WARN] [NOTIFICATION] No notification sent for ${data.id}`,
        );
      },
    },
  };
}
