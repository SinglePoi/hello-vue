export const extend = Object.assign;

export function isObject(target: unknown) {
  return target != null && typeof target === "object";
}
