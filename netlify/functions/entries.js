const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  const store = getStore('manitou-entries');

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  try {
    if (event.httpMethod === 'GET') {
      const entries = await store.get('all-entries', { type: 'json' }) || [];
      return { statusCode: 200, headers, body: JSON.stringify(entries) };
    }

    if (event.httpMethod === 'POST') {
      const newEntry = JSON.parse(event.body);
      let entries = await store.get('all-entries', { type: 'json' }) || [];
      entries.unshift(newEntry);
      await store.setJSON('all-entries', entries);
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, entries }) };
    }

    return { statusCode: 405, headers, body: 'Method not allowed' };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error' }) };
  }
};
