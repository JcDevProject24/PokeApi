# Pokédex Web

> Aplicación web interactiva para explorar el mundo Pokémon, construida con HTML, CSS y JavaScript vanilla usando la [PokéAPI](https://pokeapi.co/) pública.

---

## Características

- **Catálogo completo** — carga los más de 1.000 Pokémon con scroll infinito
- **Búsqueda con autocompletado** — sugiere nombres en tiempo real mientras escribes
- **Filtros avanzados** — por tipo, Pokédex regional o generación
- **Modal de detalle** con:
  - Imagen oficial de alta resolución
  - Tipos, altura y peso
  - Habilidades (indicando las ocultas)
  - Barras de estadísticas base
  - Mapa interactivo del hábitat (Leaflet + OpenStreetMap)
- **Diseño responsivo** — funciona en móvil, tablet y escritorio
- **Sin dependencias** — solo Leaflet cargado desde CDN; no requiere npm ni bundler

---

## Capturas de pantalla

| Portada | Detalle |
|---------|---------|
| *Grid de tarjetas con filtros en la cabecera* | *Modal con stats, habilidades y mapa* |

---

## Tecnologías

| Tecnología | Uso |
|------------|-----|
| HTML5 | Estructura semántica |
| CSS3 | Grid, Flexbox, animaciones |
| JavaScript ES2020 | Lógica, fetch, DOM |
| [PokéAPI v2](https://pokeapi.co/) | Datos de Pokémon |
| [Leaflet 1.9.4](https://leafletjs.com/) | Mapa interactivo de hábitat |
| [OpenStreetMap](https://www.openstreetmap.org/) | Teselas del mapa |

---

## Estructura del proyecto

```
pokeapi/
├── index.html          # Página principal
├── assets/
│   ├── app.js          # Lógica de la aplicación
│   └── styles.css      # Estilos
├── .gitignore
├── CHANGELOG.md
├── LICENSE
└── README.md
```

---

## Uso

No requiere instalación. Basta con abrir `index.html` en el navegador o servirlo con cualquier servidor estático:

```bash
# Con Python
python -m http.server 8080

# Con Node.js (npx)
npx serve .
```

Luego accede a `http://localhost:8080`.

---

## API Reference

La aplicación consume los siguientes endpoints de PokéAPI:

| Endpoint | Uso |
|----------|-----|
| `GET /pokemon?limit=&offset=` | Listado paginado |
| `GET /pokemon/{name}` | Detalle del Pokémon |
| `GET /pokemon-species/{name}` | Especie y hábitat |
| `GET /type/{id}` | Pokémon por tipo |
| `GET /pokedex/{name}` | Pokédex regional |
| `GET /generation/{name}` | Pokémon por generación |

---

## Cómo contribuir

1. Haz un fork del repositorio
2. Crea una rama: `git checkout -b feature/mi-mejora`
3. Realiza tus cambios y haz commit: `git commit -m "feat: descripción"`
4. Abre un Pull Request describiendo los cambios

---

## Autor

**Jorge Carrillo** · [JcDevProject24](https://github.com/JcDevProject24)

*Frontend Developer | React, TypeScript & Node.js. Explorando nuevas tecnologías y en constante crecimiento como desarrollador.*

[![GitHub](https://img.shields.io/badge/GitHub-JcDevProject24-181717?logo=github)](https://github.com/JcDevProject24)
[![Email](https://img.shields.io/badge/Email-JcDevProject24%40gmail.com-D14836?logo=gmail&logoColor=white)](mailto:JcDevProject24@gmail.com)

---

## Licencia

Distribuido bajo la licencia **MIT**. Consulta el archivo [LICENSE](LICENSE) para más información.

---

> *Pokémon y todos los nombres relacionados son marcas registradas de Nintendo / Creatures Inc. / GAME FREAK inc. Este proyecto es de carácter educativo y no tiene afiliación oficial.*
