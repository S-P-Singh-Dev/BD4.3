let express = require('express');
let cors = require('cors');
let sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');

const app = express();
const port = 3010;
app.use(cors());
app.use(express.json());

let db;

(async () => {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });
})();

async function fetchMoviesByActor(actor) {
  let query = 'SELECT * FROM movies WHERE actor = ?';
  let result = await db.all(query, [actor]);
  return { movies: result };
}

async function fetchMoviesByDirector(director) {
  let query = 'SELECT * FROM movies WHERE director = ?';
  let result = await db.all(query, [director]);
  return { movies: result };
}

async function fetchAllMovies() {
  let query = 'SELECT id, title, release_year FROM movies';
  let result = await db.all(query, []);
  return { movies: result };
}

async function fetchMoviesByActor(actor) {
  let query = 'SELECT id, title, release_year FROM movies WHERE actor = ?';
  let result = await db.all(query, [actor]);
  return { movies: result };
}

app.get('/movies/actor/:actor', async (req, res) => {
  let actor = req.params.actor;

  try {
    const result = await fetchMoviesByActor(actor);
    if (result.movies.length === 0) {
      res.status(404).json({ movies: 'No movies found' });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/movies/director/:director', async (req, res) => {
  const director = req.params.director;
  try {
    const result = await fetchMoviesByDirector(director);
    if (result.movies.length === 0) {
      res.status(404).json({ movies: 'No movies found' });
    } else {
      res.status(200).json({ result });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/movies', async (req, res) => {
  try {
    const result = await fetchAllMovies();
    if (result.movies.length === 0) {
      res.status(404).json({ movies: 'No movies found' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/movies/actor/:actor', async (req, res) => {
  try {
    const actor = req.params.actor;
    const result = await fetchMoviesByActor(actor);
    if (result.movies.length === 0) {
      res.status(404).json({ movies: 'No movies found' });
    }
    res.status(200).json({ movies: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
