// Elementos DOM
const busqueda = document.getElementById("busqueda");
const sugerencias = document.getElementById("sugerencias");
const tipos_filtro = document.getElementById("filtro");
const select = document.getElementById("select");
const zonaResultados = document.getElementById("resultados");
const modal = document.getElementById("modal");
const modalDatos = document.getElementById("modalDatos");
const btnCerrarModal = document.getElementById("cerrarModal");
const mensajesDiv = document.getElementById("mensajes");

select.style.display = "none";
modal.style.display = "none";

let nombres = null;
document.getElementById("resetFiltros").onclick = () => {
  tipos_filtro.value = "todo";
  tipos_filtro.dispatchEvent(new Event("change"));
};
// Funciones
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

//  Función para mostrar mensajes
function mostrarMensaje(texto, tipo = "error") {
  // tipo puede ser "error" o "info"
  mensajesDiv.innerHTML = `<div class="mensaje ${tipo}">${texto}</div>`;
  // opcional: desaparecer mensaje después de 3 segundos
  setTimeout(() => (mensajesDiv.innerHTML = ""), 3000);
}

function agregarCard({ id, nombre }) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png" alt="${nombre}" loading="lazy">
          <span class="numero">#${String(id).padStart(4, "0")}</span>
          <h3>${nombre}</h3>
        `;
  card.onclick = () => cargarPokemonDetalle(nombre);
  zonaResultados.appendChild(card);
}

function cargarPokemonDetalle(nombre) {
  // Pide un "paquete HTTP"
  fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`)
    // convierto el paquete con json, a un objeto javascript
    .then((r) => r.json())
    //creo variable o caja poke
    .then((poke) => {
      //diccionario de traduccion
      const statNames = {
        hp: "PS",
        attack: "Ataque",
        defense: "Defensa",
        "special-attack": "At. Esp.",
        "special-defense": "Def. Esp.",
        speed: "Velocidad",
      };

      const sprite =
        poke.sprites.other["official-artwork"].front_default ||
        poke.sprites.front_default;

      const tipos = poke.types
        .map(
          (t) => `<span class="tipo tipo-${t.type.name}">${t.type.name}</span>`,
        )
        .join("");

      const habs = poke.abilities
        .map(
          (a) =>
            `<span class="habilidad ${a.is_hidden ? "oculta" : ""}">${a.ability.name}${a.is_hidden ? " ★" : ""}</span>`,
        )
        .join("");

      const stats = poke.stats
        .map(
          (s) => `
                <div class="stat-fila">
                  <span class="stat-nombre">${statNames[s.stat.name] || s.stat.name}</span>
                  <span class="stat-valor">${s.base_stat}</span>
                  <div class="stat-barra-bg">
                    <div class="stat-barra" style="width:${Math.round((s.base_stat / 255) * 100)}%"></div>
                  </div>
                </div>
              `,
        )
        .join("");

      modalDatos.innerHTML = `
              <img src="${sprite}" alt="${poke.name}">
              <h2>${poke.name} <small>#${String(poke.id).padStart(4, "0")}</small></h2>
              <div class="tipos">${tipos}</div>
              <div class="modal-info">
                <span>Altura: ${poke.height / 10} m</span>
                <span>Peso: ${poke.weight / 10} kg</span>
              </div>
              <h4>Habilidades</h4>
              <div class="habilidades">${habs}</div>
              <small class="nota">★ = habilidad oculta</small>
              <h4>Estadísticas</h4>
              <div class="stats">${stats}</div>
              <h4>Hábitat</h4>
              <div id="mapa""></div>
            `;
      modal.style.display = "flex";
      // Obtener habitat desde pokemon-species
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${nombre}`)
        .then((r) => r.json())
        .then((species) => {
          const habitat = species.habitat?.name || "unknown";
          setTimeout(() => crearMapa(habitat), 100);
        })
        .catch(() => console.log("No se pudo cargar habitat"));
    })
    .catch(() => mostrarMensaje("Error al buscar Pokémon", "error"));
}

btnCerrarModal.onclick = () => (modal.style.display = "none");
modal.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") modal.style.display = "none";
});

busqueda.addEventListener("keyup", async (e) => {
  let texto = busqueda.value.toLowerCase().trim();
  sugerencias.innerHTML = "";
  if (!texto) return (sugerencias.style.display = "none");

  // Presionar Enter abre el modal del Pokémon escrito

  // busco el primer nombre que empiece con el texto, si existe
  if (e.key === "Enter" && texto !== "") {
    const primera = nombres?.find((n) => n.startsWith(texto));
    const nombreFinal = primera || texto;
    cargarPokemonDetalle(nombreFinal);
    sugerencias.style.display = "none";
    return;
  }

  if (!nombres) {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=2000");
    nombres = (await res.json()).results.map((p) => p.name);
  }

  const filtrados = nombres.filter((n) => n.startsWith(texto)).slice(0, 6);

  if (!filtrados.length) {
    sugerencias.innerHTML = "<li>Ningún Pokémon encontrado</li>";
    sugerencias.style.display = "block";
    return;
  }

  // Mostrar lista de sugerencias y llamar al modal al hacer clic
  sugerencias.innerHTML = filtrados
    .map(
      (n) =>
        `<li onclick="busqueda.value='${n}'; sugerencias.style.display='none'; cargarPokemonDetalle('${n}')">${n}</li>`,
    )
    .join("");
  sugerencias.style.display = "block";
});

document.addEventListener("click", (e) => {
  if (!busqueda.contains(e.target)) sugerencias.style.display = "none";
});

// Variables de control
let offset = 0;
let limit = 25;
let cargando = false;
let hayMas = true;
let listaActual = [];
let tipoFiltroActual = "todo";
let valorFiltroActual = "";

// Función unificada de carga
async function cargarPokemon() {
  if (cargando || !hayMas) return;
  cargando = true;

  try {
    if (tipoFiltroActual === "todo" || valorFiltroActual === "") {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`,
      );
      const data = await res.json();
      data.results.forEach((p) => {
        const id = p.url.split("/").filter(Boolean).pop();
        agregarCard({ id, nombre: p.name });
      });
      hayMas = !!data.next;
      offset += limit;
    } else {
      if (listaActual.length === 0) {
        let data;
        if (tipoFiltroActual === "type") {
          data = await (
            await fetch(`https://pokeapi.co/api/v2/type/${valorFiltroActual}`)
          ).json();
          listaActual = data.pokemon
            .map((p) => p.pokemon)
            .filter((p) => !p.name.includes("-"));
        } else if (tipoFiltroActual === "pokedex") {
          data = await (
            await fetch(
              `https://pokeapi.co/api/v2/pokedex/${valorFiltroActual}`,
            )
          ).json();
          listaActual = data.pokemon_entries.map((e) => e.pokemon_species);
        } else if (tipoFiltroActual === "generation") {
          data = await (
            await fetch(
              `https://pokeapi.co/api/v2/generation/${valorFiltroActual}`,
            )
          ).json();
          listaActual = data.pokemon_species;

          // Ordenar por ID, ya que la API no garantiza orden en generación
          listaActual.sort((a, b) => {
            const idA = a.url.split("/").filter(Boolean).pop();
            const idB = b.url.split("/").filter(Boolean).pop();
            return idA - idB;
          });
        }
      }
      const bloque = listaActual.slice(offset, offset + limit);
      bloque.forEach((p) => {
        const id = p.url.split("/").filter(Boolean).pop();
        agregarCard({ id, nombre: p.name });
      });
      offset += limit;
      hayMas = offset < listaActual.length;
    }
  } catch {
    mostrarMensaje("Error al cargar Pokémon", "error");
  }

  cargando = false;
}

// Cambio de filtro principal
tipos_filtro.addEventListener("change", async () => {
  select.innerHTML = '<option value="">Selecciona una opción</option>';
  tipoFiltroActual = tipos_filtro.value;

  // Mostrar u ocultar el segundo select
  select.style.display = tipoFiltroActual === "todo" ? "none" : "inline-block";

  // Si el filtro es "todo", limpiar y cargar todos los Pokémon
  if (tipoFiltroActual === "todo") {
    valorFiltroActual = "";
    offset = 0;
    hayMas = true;
    zonaResultados.innerHTML = "";
    listaActual = [];
    cargarPokemon();
    return;
  }

  // Para filtros que requieren selección secundaria, dejamos los Pokémon actuales visibles
  valorFiltroActual = "";
  listaActual = [];

  // Llenar select según tipo de filtro
  if (tipoFiltroActual === "type") {
    for (let i = 1; i <= 18; i++) {
      const data = await (
        await fetch(`https://pokeapi.co/api/v2/type/${i}`)
      ).json();
      const opcion = document.createElement("option");
      opcion.value = data.name;
      opcion.textContent =
        data.names.find((n) => n.language.name === "es")?.name || data.name;
      select.appendChild(opcion);
    }
  } else if (tipoFiltroActual === "pokedex") {
    const data = await fetch("https://pokeapi.co/api/v2/pokedex").then((r) =>
      r.json(),
    );
    data.results.forEach((p) => {
      const opcion = document.createElement("option");
      opcion.value = p.name;
      opcion.textContent = capitalize(p.name);
      select.appendChild(opcion);
    });
  } else if (tipoFiltroActual === "generation") {
    const data = await fetch("https://pokeapi.co/api/v2/generation").then((r) =>
      r.json(),
    );
    data.results.forEach((gen, index) => {
      const opcion = document.createElement("option");
      opcion.value = gen.name;
      opcion.textContent = `${index + 1}° Generación`;
      select.appendChild(opcion);
    });
  }
});

select.addEventListener("change", () => {
  valorFiltroActual = select.value;
  offset = 0;
  hayMas = true;
  listaActual = []; // vaciar listaActual para que recalcule Pokémon
  zonaResultados.innerHTML = "";
  cargarPokemon();
});

//  Scroll infinito
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
    cargarPokemon();
  }
});

function crearMapa(habitat) {
  const coordenadas = {
    forest: [40.4168, -3.7038],
    sea: [36.0, -5.0],
    mountain: [46.8523, -121.7603],
    cave: [43.0, -6.0],
    grassland: [48.8566, 2.3522],
    urban: [51.5074, -0.1278],
    rare: [35.6895, 139.6917],
    unknown: [0, 0],
  };

  const coords = coordenadas[habitat] || [0, 0];

  const mapaDiv = document.getElementById("mapa");
  if (!mapaDiv) return;

  mapaDiv.innerHTML = "";

  const mapa = L.map(mapaDiv).setView(coords, 4);
// tesela
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(mapa);

  L.marker(coords)
    .addTo(mapa)
    .bindPopup("Hábitat: " + habitat)
    .openPopup();
}
// Carga inicial
cargarPokemon();
