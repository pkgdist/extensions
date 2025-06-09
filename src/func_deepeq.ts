// func_deepeq.ts
/**
 * Deep comparison utility functions for objects.
 *
 * This module provides functions to compare objects deeply, excluding specific paths,
 * @param obj1 - The first object to compare.
 * @param obj2 - The second object to compare.
 * @param pathsToCompare - An array of strings representing the paths to compare.
 * @returns A string indicating whether the specified paths in the objects are equal.
 */

export type ObjectMatcher<T> = {
  [K in keyof T]: T[K] extends object ? ObjectMatcher<T[K]> : T[K]
}

export function deepCompareExclude(
  obj1: Record<string, any>,
  obj2: Record<string, any>,
  pathsToCompare: string[],
): string {
  function getValueByPath(
    obj: Record<string, any>,
    path: string,
  ): Record<string, any> | undefined {
    return path.split('.').reduce(
      (acc, key) => (acc ? acc[key] : undefined),
      obj,
    )
  }

  for (const path of pathsToCompare) {
    const val1 = getValueByPath(obj1, path)
    const val2 = getValueByPath(obj2, path)

    if (deepEqual(val1, val2)) {
      return 'false' // Specified parts match, return false
    }
  }
  return 'true' // Specified parts don't match, return true
}

export function deepEqual(a: any, b: any): boolean {
  if (a === b) return true

  if (
    typeof a !== 'object' || a === null ||
    typeof b !== 'object' || b === null
  ) return false

  const keysA = Object.keys(a)
  const keysB = Object.keys(b)

  if (keysA.length !== keysB.length) return false

  for (const key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false
  }

  return true
}
