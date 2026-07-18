# Diagnóstico de soporte nivel 2

App web simple: el usuario describe un problema técnico y recibe un diagnóstico
generado por IA (causas probables + pasos de solución).

## Estructura

- `index.html` — la página que ve el usuario.
- `netlify/functions/diagnose.js` — función serverless que llama a la API de
  Claude de forma segura (la clave nunca se expone en el navegador).
- `netlify.toml` — configuración para que Netlify reconozca la función.

## Cómo desplegarlo gratis en Netlify

1. Crea una cuenta gratuita en https://www.netlify.com (plan "Starter", sin costo).
2. Consigue una clave de API de Anthropic en https://console.anthropic.com
   (Settings → API Keys). Nota: el uso de la API tiene costo por token, aparte
   de Netlify, que sí es gratuito para este uso.
3. Opción A — arrastrar y soltar (la más simple):
   - Comprime esta carpeta o súbela tal cual desde el panel de Netlify:
     "Add new site" → "Deploy manually" → arrastra la carpeta del proyecto.
4. Opción B — conectada a un repositorio de Git (recomendada si vas a seguir
   editando):
   - Sube esta carpeta a un repositorio en GitHub/GitLab.
   - En Netlify: "Add new site" → "Import an existing project" → conecta el
     repositorio.
5. Configura la variable de entorno con tu clave:
   - En el panel del sitio: Site configuration → Environment variables →
     "Add a variable" → nombre `ANTHROPIC_API_KEY`, valor tu clave.
   - Vuelve a desplegar el sitio para que tome la variable (Deploys → Trigger deploy).
6. Netlify te da una URL pública (algo como `tu-app.netlify.app`) — esa es tu
   herramienta lista para usar.

## Notas

- La clave de API nunca debe ponerse en `index.html` ni en ningún archivo del
  frontend — por eso vive solo en la función serverless, protegida por la
  variable de entorno.
- El plan gratuito de Netlify incluye funciones serverless con un límite
  mensual de invocaciones que es más que suficiente para un equipo de soporte
  interno.
- Si más adelante quieres restringir quién puede usar la app (por ejemplo solo
  tu equipo), se puede añadir autenticación con Netlify Identity (también
  incluida en el plan gratuito).
