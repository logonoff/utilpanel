export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number,
) => {
  let timeout: ReturnType<typeof setTimeout>;
  return function (this: unknown, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
};
