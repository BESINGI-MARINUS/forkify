import { async } from 'regenerator-runtime';
import { TIMEOUT_SECS } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, dataToSend = undefined) {
  try {
    const fetchPro = dataToSend
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        })
      : fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SECS)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message}(${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

// export const getJson = async function (url) {
//   try {
//     const fetchPro = fetch(url);
//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SECS)]);
//     const data = await res.json();
//     if (!res.ok) throw new Error(`${data.message}(${res.status})`);
//     return data;
//   } catch (err) {
//     throw err;
//   }
// };
// export const sendJson = async function (url, dataToSend) {
//   try {
//     const fetchPro = fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(dataToSend),
//     });
//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SECS)]);
//     const data = await res.json();
//     if (!res.ok) throw new Error(`${data.message}(${res.status})`);
//     return data;
//   } catch (err) {
//     throw err;
//   }
// };
