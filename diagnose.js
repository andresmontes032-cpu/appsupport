// Función serverless de Netlify.
// Recibe la descripción del problema desde el frontend y consulta la API de Claude.
// La clave de API vive solo en el servidor (variable de entorno), nunca en el navegador.

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  let problema;
  try {
    const body = JSON.parse(event.body || "{}");
    problema = body.problema;
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: "Cuerpo inválido" }) };
  }

  if (!problema || typeof problema !== "string") {
    return { statusCode: 400, body: JSON.stringify({ error: "Falta la descripción del problema" }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Falta configurar ANTHROPIC_API_KEY en el entorno del servidor" })
    };
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content:
              "Actúa como soporte de nivel 2 de TI. Diagnostica el siguiente problema con posibles causas (de más a menos probable) y pasos concretos de solución, en español, de forma breve y accionable:\n\n" +
              problema
          }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return { statusCode: response.status, body: JSON.stringify({ error: errText }) };
    }

    const data = await response.json();
    const textBlock = (data.content || []).find((c) => c.type === "text");
    const diagnostico = textBlock ? textBlock.text : "No se recibió texto en la respuesta.";

    return {
      statusCode: 200,
      body: JSON.stringify({ diagnostico })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
