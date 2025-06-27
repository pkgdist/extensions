import { assert, assertEquals, assertThrows } from 'jsr:@std/assert@1.0.13'
import {
  ensurePathExists,
  getFilePermissions,
  scanDirectoryForPermissions,
} from '../func_permissions.ts'
import { dirname, fromFileUrl } from 'jsr:@std/path@^1.1.0'

Deno.test('ensurePathExists throws for non-existent directory', () => {
  assertThrows(
    () => ensurePathExists('/unlikely/to/exist/dir'),
    Error,
    'Directory does not exist',
  )
})

Deno.test('ensurePathExists does not throw for existing directory', () => {
  const dir = dirname(fromFileUrl(import.meta.url))
  ensurePathExists(dir)
})

Deno.test('scanDirectoryForPermissions returns "false" if all files match permission', async () => {
  const tempDir = await Deno.makeTempDir()
  const tempFile = await Deno.makeTempFile({ dir: tempDir, suffix: '.sh' })
  await Deno.chmod(tempFile, 0o777)

  const result = await scanDirectoryForPermissions(tempDir, '.sh', 1, '+x')
  assert(result.includes('false'))
  await Deno.remove(tempFile)
})

Deno.test('getFilePermissions returns correct permission details for a file', async () => {
  const tempDir = await Deno.makeTempDir()
  const tempFile = await Deno.makeTempFile({ dir: tempDir, suffix: '.sh' })
  await Deno.chmod(tempFile, 0o777)
  const perms = await getFilePermissions(tempFile)
  assertEquals(perms.isFile, true)
  assertEquals(perms.isDirectory, false)
  assertEquals(perms.basename, tempFile.split('/').pop())
  assert(typeof perms.mode === 'number')
  assert(typeof perms.ownerRead === 'boolean')
  assert(typeof perms.ownerWrite === 'boolean')
  assert(typeof perms.ownerExec === 'boolean')
  assert(typeof perms.groupRead === 'boolean')
  assert(typeof perms.groupWrite === 'boolean')
  assert(typeof perms.groupExec === 'boolean')
  assert(typeof perms.othersRead === 'boolean')
  assert(typeof perms.othersWrite === 'boolean')
  assert(typeof perms.othersExec === 'boolean')
  assert(typeof perms.setuid === 'boolean')
  assert(typeof perms.setgid === 'boolean')
  assert(typeof perms.sticky === 'boolean')
  assert(typeof perms.permissionsString === 'string')
  await Deno.remove(tempFile)
})

Deno.test('scanDirectoryForPermissions returns "false" if all files match permission', async () => {
  const tempDir = await Deno.makeTempDir()
  const tempFile = await Deno.makeTempFile({ dir: tempDir, suffix: '.test' })
  await Deno.chmod(tempFile, 0o777)
  // Make the file executable for owner

  const result = await scanDirectoryForPermissions(tempDir, '.test', 0, '+x')
  assert(result == 'false')
  await Deno.remove(tempFile)
})

Deno.test('scanDirectoryForPermissions returns "true" if any file does not match permission', async () => {
  const tempDir = await Deno.makeTempDir()
  const tempFile = await Deno.makeTempFile({ dir: tempDir, suffix: '.what' })
  await Deno.chmod(tempFile, 0o777)

  // Remove execute permissions
  await Deno.chmod(tempFile, 0o600)
  const result = await scanDirectoryForPermissions(tempDir, '.what', 0, '+x')
  assertEquals(result, 'true')
  await Deno.remove(tempFile)
})
