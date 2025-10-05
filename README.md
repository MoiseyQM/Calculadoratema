# Calculadora web

Aplicación de calculadora hecha con HTML, CSS y JavaScript puro. Incluye selector de temas, historial de operaciones recientes y atajos de teclado para trabajar sólo con archivos estáticos.

## Archivos clave

- `index.html`: estructura principal.
- `styles.css`: estilos y temas.
- `script.js`: comportamiento de la interfaz, historial y selector de temas.
- `calculator-core.js`: funciones que realizan los cálculos.

## Requisitos

Únicamente necesitas un navegador moderno. Git y una cuenta en GitHub son opcionales si quieres publicarla.

## Uso local

1. Descarga o clona esta carpeta en tu equipo.
2. Abre `index.html` con doble clic o arrástralo al navegador.
3. Calcula usando los botones o el teclado, cambia el tema desde el menú “Tema” y limpia el historial cuando lo necesites.

## Subir el código a tu repositorio

1. Crea un repositorio vacío en GitHub (por ejemplo, `calculadora-web`).
2. Desde la carpeta del proyecto ejecuta:
   ```powershell
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<tu-usuario>/<tu-repo>.git
   git push -u origin main
   ```

## Publicar con GitHub Pages

1. En GitHub abre **Settings → Pages**.
2. Selecciona la rama `main` y la carpeta raíz `/`.
3. Guarda y espera a que aparezca la URL pública.

## Personaliza más

- Ajusta colores o añade nuevos temas modificando las variables CSS.
- Cambia el número máximo de operaciones guardadas editando `slice(0, 20)` en `script.js`.
