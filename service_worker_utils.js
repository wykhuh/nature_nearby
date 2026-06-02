export function throttleAsync(func, delayMS) {
  let lastRun = 0;
  let timeouts = [];

  // @ts-ignore
  async function throttled(...args) {
    const currentWait = lastRun + delayMS - Date.now();
    const shouldRun = currentWait <= 0;

    if (shouldRun) {
      lastRun = Date.now();
      try {
        return await func(...args);
      } catch (error) {
        return await new Promise(function (_resolve, reject) {
          reject(error);
        });
      }
    } else {
      return await new Promise(function (resolve) {
        let timeout = setTimeout(function () {
          resolve(throttled(...args));
        }, currentWait);
        timeouts.push(timeout);
      });
    }
  }

  throttled.cancel = function () {
    timeouts.forEach((timeout) => {
      clearTimeout(timeout);
    });
    timeouts = [];
  };

  return throttled;
}

export function logger(...text) {
  console.log(...text);
}
