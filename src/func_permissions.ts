import { existsSync } from 'jsr:@std/fs@1.0.18'
import { readdirSync } from 'node:fs'
import { stat } from 'node:fs/promises'
import { basename } from 'jsr:@std/path@1.1.0/basename'

/**
 * @function ensurePathExists
 * @description Ensures the provided directory path exists.
 * @param directory - The repository path to scan.
 * @throws Error if the directory does not exist.
 */
export function ensurePathExists(directory: string): void {
  if (!existsSync(directory)) {
    throw new Error(`Directory does not exist: ${directory}`)
  }
}

/**
 * @function scanDirectory
 * @description Recursively scans the directory for files matching the extension and depth.
 * @param directory - The current directory to scan.
 * @param extension - The file extension to look for (e.g., '.js').
 * @param depth - How deep to scan (integer).
 * @param currentDepth - The current depth of the scan.
 * @returns string[] - List of file paths matching the criteria.
 */
export function scanDirectory(
  directory: string,
  extension: string,
  depth: number,
  currentDepth: number = 0,
): string[] {
  if (currentDepth > depth) return []
  const files: string[] = []
  const entries = readdirSync(directory, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = `${directory}/${entry.name}`
    if (entry.isDirectory()) {
      files.push(...scanDirectory(fullPath, extension, depth, currentDepth + 1))
    } else if (entry.isFile() && entry.name.endsWith(extension)) {
      files.push(fullPath)
    }
  }

  return files
}

export async function getFilePermissions(
  path: string,
): Promise<Record<string, boolean | string | number>> {
  const info = await stat(path)
  const mode = info.mode ?? 0

  // Permission bits
  const ownerRead = !!(mode & 0o400)
  const ownerWrite = !!(mode & 0o200)
  const ownerExec = !!(mode & 0o100)
  const groupRead = !!(mode & 0o040)
  const groupWrite = !!(mode & 0o020)
  const groupExec = !!(mode & 0o010)
  const othersRead = !!(mode & 0o004)
  const othersWrite = !!(mode & 0o002)
  const othersExec = !!(mode & 0o001)

  // Special bits
  const setuid = !!(mode & 0o4000)
  const setgid = !!(mode & 0o2000)
  const sticky = !!(mode & 0o1000)

  return {
    path,
    basename: basename(path),
    mode,
    ownerRead,
    ownerWrite,
    ownerExec,
    groupRead,
    groupWrite,
    groupExec,
    othersRead,
    othersWrite,
    othersExec,
    setuid,
    setgid,
    sticky,
    isFile: info.isFile(),
    isDirectory: info.isDirectory(),
    isSymlink: info.isSymbolicLink(),
    size: info.size,
    mtime: info.mtime?.toISOString(),
    atime: info.atime?.toISOString(),
    ctime: info.ctime?.toISOString(),
    permissionsString: mode.toString(8).padStart(4, '0'),
  }
}

/**
 * @function scanDirectoryForPermissions
 * @description Scans a directory for files matching the given extension, depth, and permission.
 * @param directory - The repository path to scan.
 * @param extension - The file extension to look for (e.g., '.js').
 * @param depth - How deep to scan (integer).
 * @param permission - The permission to check for (e.g., '+x').
 * @returns string - 'true' if any files do not contain the permission, 'false' if all files match the permission.
 */
export async function scanDirectoryForPermissions(
  directory: string,
  extension: string,
  depth: number,
  permission: string,
): Promise<string> {
  ensurePathExists(directory)

  const matchingFiles = scanDirectory(directory, extension, depth)

  for (const file of matchingFiles) {
    const perms = await getFilePermissions(file)
    // Example: permission '+x' means at least one exec bit is set
    if (permission === '+x') {
      if (!(perms.ownerExec || perms.groupExec || perms.othersExec)) {
        return 'true' // At least one file does not match the permission
      }
    }
    // Add more permission checks as needed
  }
  return 'false' // All files match the permission
}
