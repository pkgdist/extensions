/**
 * @function checkItemsExist
 * @description Checks whether specific items exist in the file contents and returns true if none match.
 * @param fileContents - The contents of the file as a string.
 * @returns boolean - true if none of the items match, false otherwise.
 */
export function checkItemsExist(fileContents: string): string {
  const patterns = [
    /@mckesson\/connect-codeowners-commons/,
    /\.github\/\s*@mckesson\/b2b-connect-epam-admin/,
    /connect\.yml\s*@mckesson\/b2b-connect-epam-admin/,
  ]

  for (const regex of patterns) {
    if (regex.test(fileContents)) {
      return 'false' // matches found
    }
  }

  return 'true'
}
