
# Explicación paso a paso del código SPA

Este código crea una **SPA (Single Page Application)**, o sea, una aplicación web que **no recarga toda la página** cada vez que el usuario navega entre secciones. En lugar de eso, **cambia solo el contenido necesario** en el DOM, lo que da como resultado una navegación más rápida y fluida.

---

## 1. Definición de rutas

```js
const routes = {
  "/": "./home.html",
  "/home": "./home.html",
  "/contador": "./contador.html",
  "/info": "./info.html"
};
```

Aquí se crea un **objeto llamado `routes`** que actúa como un **"mapa de rutas"**. Indica qué archivo HTML debe cargarse para cada ruta del navegador.  
Ejemplo:
- Si el usuario va a `/contador`, se carga `contador.html`.

---

## 2. Estado de la aplicación (reactividad)

```js
const state = {
  _nombre: "",
  _contador: 0,
  ...
};
```

Este objeto `state` **almacena el estado interno** de la app: un nombre y un contador. Tiene **getters y setters personalizados** que actualizan el DOM automáticamente cuando cambia algún valor:

### Ejemplo:
```js
set nombre(valor) {
  this._nombre = valor;
  const output = document.getElementById("nombreOutput");
  if (output) output.textContent = valor || "---";
}
```

Cuando el valor del nombre cambia, **se actualiza automáticamente el texto en la página** sin necesidad de recargarla.  
Este mecanismo es una forma básica de **reactividad manual**.

---

## 3. Función de navegación (sin recargar la página)

```js
async function navigate(pathname) {
  const route = routes[pathname] || routes["/"];
  const html = await fetch(route).then(res => res.text());
  document.getElementById("content").innerHTML = html;
  setupEvents();
  history.pushState({}, "", pathname);
}
```

Esta función:
1. Busca la ruta solicitada en el objeto `routes`.
2. Carga el archivo HTML usando `fetch`.
3. Inserta ese HTML en un elemento del DOM con `id="content"` (sin recargar la página).
4. Llama a `setupEvents()` para activar los eventos (como botones o inputs).
5. Usa `history.pushState` para cambiar la URL del navegador sin recargar.

Esto es el núcleo de una SPA: navegar sin hacer un "full refresh" del navegador.

---

## 4. Activación de eventos de UI

```js
function setupEvents() {
  const nombreInput = document.getElementById("nombreInput");
  ...
}
```

Esta función **busca elementos en el nuevo HTML cargado** (como el input de nombre y los botones) y **les añade eventos**:

- Cuando alguien escribe en el input, actualiza el estado.
- Cuando se hace clic en los botones de contador, se incrementa o decrementa su valor.

---

## 5. Captura de clics en los enlaces

```js
document.body.addEventListener("click", e => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    navigate(e.target.getAttribute("href"));
  }
});
```

Esto permite que los enlaces de navegación (como los botones de menú) **no hagan un recargo completo de la página**. En lugar de eso, capturamos el clic y llamamos manualmente a `navigate()` para cargar la nueva sección dinámicamente.

Importante: los enlaces deben tener el atributo `data-link` para que esto funcione.

---

## 6. Manejo de navegación del navegador (adelante/atrás)

```js
window.addEventListener("popstate", () => navigate(location.pathname));
```

Esto permite que al usar los botones "adelante" y "atrás" del navegador, se cargue correctamente el contenido correspondiente de la SPA, sin recargar todo.

---

## 7. Carga inicial

```js
window.addEventListener("DOMContentLoaded", () => navigate(location.pathname));
```

Cuando la página se abre por primera vez, esta línea se encarga de **cargar el contenido correspondiente a la URL actual** automáticamente.

---

## Conclusión

Este ejemplo de SPA:

- **Evita recargas completas** del navegador.
- **Carga contenido dinámicamente** usando `fetch`.
- **Actualiza el DOM de forma reactiva** usando setters.
- **Mejora la experiencia de usuario**, haciendo que la navegación sea más rápida y fluida.

