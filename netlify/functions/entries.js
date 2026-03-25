const { getStore } = require("@netlify/blobs");
exports.handler = async (event) => {
  const headers = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Content-Type","Content-Type":"application/json"};
  if (event.httpMethod === "OPTIONS") return {statusCode:200,headers,body:""};
  const store = getStore("manitou-entries");
  if (event.httpMethod === "GET") {
    try {
      let entries = [];
      try { const raw = await store.get("all-entries"); if (raw) entries = JSON.parse(raw); } catch(e) {}
      return {statusCode:200,headers,body:JSON.stringify(entries)};
    } catch(err) { return {statusCode:500,headers,body:JSON.stringify({error:err.message})}; }
  }
  if (event.httpMethod === "POST") {
    try {
      const entry = JSON.parse(event.body);
      let entries = [];
      try { const raw = await store.get("all-entries"); if (raw) entries = JSON.parse(raw); } catch(e) {}
      entry.ts = new Date().toISOString();
      entries.push(entry);
      await store.set("all-entries", JSON.stringify(entries));
      return {statusCode:200,headers,body:JSON.stringify({success:true,total:entries.length})};
    } catch(err) { return {statusCode:500,headers,body:JSON.stringify({error:err.message})}; }
  }
  return {statusCode:405,headers,body:"Method not allowed"};
};
