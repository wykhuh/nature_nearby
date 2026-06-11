export function sampleArray(array: any[]) {
  return array[Math.floor(Math.random() * array.length)];
}

// https://stackoverflow.com/a/39914235
export function sleep(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export function pluralize(
  number: number | undefined,
  text: string,
  useComma = false,
) {
  if (number === undefined) number = 0;
  let displayNumber = useComma ? number.toLocaleString() : number;
  if (number === 1) {
    return `${displayNumber} ${text}`;
  } else {
    return `${displayNumber} ${text}s`;
  }
}

export function toggleFullScreen(element: HTMLElement) {
  if (!document.fullscreenElement) {
    element.requestFullscreen();
  } else {
    document.exitFullscreen?.();
  }
}

function throttleAsync(func: (...args: any[]) => {}, delayMS: number) {
  let lastRun = 0;
  let timeouts: any[] = [];

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

const apiThrottleTime = 1000;
export const throttledFetch = throttleAsync((url) => {
  return fetch(url);
}, apiThrottleTime);

export function range(start: number, stop: number) {
  return [...Array(stop - start + 1).keys()].map((i) => i + start);
}

export function capitalizeFirstLetter(text: string) {
  return text && text[0].toUpperCase() + text.slice(1);
}

// https://www.freecodecamp.org/news/javascript-debounce-example/
// https://stackoverflow.com/questions/42361485/how-long-should-you-debounce-text-input
export function debounce(func: (...args: any[]) => any, interval = 520) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), interval);
  };
}

// https://stackoverflow.com/a/54265129
export function debouncePromise(
  func: (...args: any[]) => Promise<any>,
  interval = 520,
) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timer);
    return new Promise((resolve) => {
      timer = setTimeout(() => resolve(func(...args)), interval);
    });
  };
}

export function displayJson(json: any, el: HTMLElement | null) {
  // fix cyclic object errors
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value#Examples
  const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (_key: string, value: any) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };

  if (el) {
    el.innerText = JSON.stringify(json, getCircularReplacer(), 2);
  }
}
