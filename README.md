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

## Personaliza más

- Ajusta colores o añade nuevos temas modificando las variables CSS.
- Cambia el número máximo de operaciones guardadas editando `slice(0, 20)` en `script.js`.
