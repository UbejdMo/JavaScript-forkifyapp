# 🍴 Forkify

A recipe search-and-storage web application built with vanilla JavaScript and a clean **MVC architecture**. Search over a million recipes, adjust servings, bookmark your favorites, upload your own recipes, and delete the ones you created.

This project was built as a from-scratch implementation of the Forkify app from Jonas Schmedtmann's *Complete JavaScript Course*, with the build tooling and a couple of dependencies modernized so it runs reliably on current Node.js versions. The application code and the end result match the original course project — see [`reasonings.md`](./reasonings.md) for the full explanation of what was changed and why.

---

## ✨ Features

- **Search** recipes from the Forkify API with a live results list
- **Pagination** of search results (10 per page) with prev/next navigation
- **View** full recipe details: image, cooking time, servings, and ingredients with proper fractions
- **Adjust servings** — all ingredient quantities recalculate live, with smooth in-place DOM updates (no flicker)
- **Bookmark** recipes, with persistence across page refreshes via `localStorage`
- **Upload** your own recipes through a modal form (sent to the API with a `POST` request)
- **Delete** recipes you uploaded (a `DELETE` request — an enhancement beyond the original course)

---

## 🛠️ Tech Stack

- **HTML5** and **Sass (SCSS)** for structure and styling
- **Vanilla JavaScript (ES6+ modules)** — no framework
- **MVC architecture** with the **publisher–subscriber pattern** connecting controller and views
- **Parcel** (v2, stable) as the zero-config bundler and dev server
- **fracty** for decimal-to-fraction conversion
- **core-js** and **regenerator-runtime** as polyfills
- **Forkify API v2** as the recipe data source

---

## 🚀 Running the Project From Scratch

Follow these steps to get the exact same setup that runs in the browser.

### Prerequisites

- **Node.js v18 or higher** (v20/v22/v24 all work). Check yours with:
  ```bash
  node --version
  ```
  If you don't have it, download it from [nodejs.org](https://nodejs.org/).

### 1. Clone the repository

```bash
git clone https://github.com/UbejdMo/JavaScript-forkifyapp.git
cd JavaScript-forkifyapp
```

### 2. Install the dependencies

```bash
npm install
```

This reads `package.json` and downloads everything into a local `node_modules` folder — the bundler (Parcel), the Sass compiler, the fraction library, and the polyfills. This is what makes your local copy match the running app.

### 3. Get a Forkify API key

The app needs a personal API key to **search** and **upload** recipes.

1. Open [https://forkify-api.jonas.io/](https://forkify-api.jonas.io/) in your browser.
2. Click **"Generate your API key"**.
3. Copy the key.
4. Open `src/js/config.js` and paste it into the `KEY` constant:
   ```js
   export const KEY = 'paste-your-key-here';
   ```

> **Note:** The API allows only **1 key request per hour** and **100 API requests per hour**, which is plenty for development. Search terms are limited to a fixed list (e.g. `pizza`, `pasta`, `cake`) — see the [API docs](https://forkify-api.jonas.io/) for the full list.

### 4. Start the development server

```bash
npm start
```

Parcel compiles the SCSS and JavaScript on the fly and serves the app with live-reload. Open the URL it prints:

```
http://localhost:1234
```

You now have the same app running locally that you'd see deployed.

### 5. (Optional) Build for production

```bash
npm run build
```

This compiles an optimized, minified version into a `/dist` folder — exactly what you'd deploy to a real web server.

---

## 📂 Project Structure

```
forkify/
├── src/
│   ├── img/                 # Icons sprite and images
│   ├── sass/                # SCSS partials (styling)
│   └── js/
│       ├── config.js        # Constants (API URL, key, timeout, etc.)
│       ├── helpers.js        # AJAX helper (GET / POST / DELETE + timeout)
│       ├── model.js          # State + business logic (the "M" in MVC)
│       ├── controller.js     # Wires model and views together (the "C")
│       └── views/            # All view classes (the "V")
│           ├── View.js          # Base class — shared rendering logic
│           ├── recipeView.js
│           ├── searchView.js
│           ├── resultsView.js
│           ├── previewView.js
│           ├── paginationView.js
│           ├── bookmarksView.js
│           └── addRecipeView.js
├── index.html
└── package.json
```

---

## 🏗️ Architecture Notes

The app follows the **Model–View–Controller** pattern:

- **Model** (`model.js`) holds all application state and handles API requests and data transformation. It knows nothing about the DOM.
- **Views** (`views/`) render data to the DOM. They all inherit shared behavior (`render`, `update`, `renderSpinner`, `renderError`, `renderMessage`) from a single `View` base class.
- **Controller** (`controller.js`) coordinates the two — it listens for events, tells the model what to do, and tells the views what to render. It touches neither the DOM nor the network directly.

Views and the controller communicate using the **publisher–subscriber pattern**: a view "publishes" an event (it owns the DOM listener), and the controller "subscribes" by passing in a handler function. This keeps DOM logic in the views and application logic in the controller.

The `update` method in the base `View` class implements a small **DOM-diffing algorithm** (the same core idea behind virtual DOMs) so that changes like adjusting servings only update the elements that actually changed, instead of re-rendering the whole recipe.

---

## 🙏 Acknowledgments

Based on the Forkify project from [Jonas Schmedtmann's Complete JavaScript Course](https://www.udemy.com/course/the-complete-javascript-course/). Recipe data provided by the [Forkify API](https://forkify-api.jonas.io/).
