import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined, method = 'GET') {
  try {
    let fetchPro;
    if (uploadData) {
      fetchPro = fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(uploadData),
      });
    } else if (method === 'DELETE') {
      fetchPro = fetch(url, { method: 'DELETE' });
    } else {
      fetchPro = fetch(url);
    }

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    // DELETE can return an empty body, so don't try to parse JSON
    if (method === 'DELETE') {
      if (!res.ok) throw new Error(`Could not delete recipe (${res.status})`);
      return;
    }

    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
