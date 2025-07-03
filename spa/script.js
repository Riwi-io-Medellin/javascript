// routes
const routes = {
  "/": "./home.html",
  "/home": "./home.html",
  "/contador": "./contador.html",
  "/info": "./info.html"
};

// state
const state = {
  _nombre: "",
  _contador: 0,

  get nombre() {
    return this._nombre;
  },
  set nombre(valor) {
    this._nombre = valor;
    const output = document.getElementById("nombreOutput");
    if (output) output.textContent = valor || "---";
  },

  get contador() {
    return this._contador;
  },
  set contador(valor) {
    this._contador = valor;
    const output = document.getElementById("contadorOutput");
    if (output) output.textContent = valor;
  }
};

async function navigate(pathname) {
  const route = routes[pathname] || routes["/"];
  const html = await fetch(route).then(res => res.text());
  document.getElementById("content").innerHTML = html;
  setupEvents();
  history.pushState({}, "", pathname);
}

function setupEvents() {
  const nombreInput = document.getElementById("nombreInput");
  if (nombreInput) {
    nombreInput.addEventListener("input", e => state.nombre = e.target.value);
    state.nombre = state.nombre; // trigger update
  }

  const btnInc = document.getElementById("incrementarBtn");
  const btnDec = document.getElementById("disminuirBtn");

  if (btnInc && btnDec) {
    btnInc.addEventListener("click", () => state.contador++);
    btnDec.addEventListener("click", () => state.contador--);
    state.contador = state.contador; // trigger update
  }
}

document.body.addEventListener("click", e => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    navigate(e.target.getAttribute("href"));
  }
});

window.addEventListener("popstate", () => navigate(location.pathname));
window.addEventListener("DOMContentLoaded", () => navigate(location.pathname));

