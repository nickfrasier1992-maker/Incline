exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: "Method not allowed" };

  try {
    const { pin } = JSON.parse(event.body);
    const ADMIN_PIN = process.env.ADMIN_PIN || "6174";
    const valid = pin === ADMIN_PIN;
    return { statusCode: 200, headers, body: JSON.stringify({ valid }) };
  } catch (err) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid request" }) };
  }
};
