const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()
const dbPath = path.join(__dirname, 'moviesData.db')
app.use(express.json())
module.exports = app
let db = null
const intializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('server is running')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}
intializeDBAndServer()

app.get('/movies/', async (request, response) => {
  const getmoviesQuery = `
    SELECT movie_name
    FROM movie
    ORDER BY movie_id;
    `
  const moviesArray = await db.all(getmoviesQuery)
  response.send(
    moviesArray.map(eachMovie => ({movieName: eachMovie.movie_name})),
  )
})

app.post('/movies/', async (request, response) => {
  const movieDetails = request.body
  const {directorId, movie_name, lead_actor} = movieDetails
  const addMovieQuery = `
  INSERT INTO 
  movie(director_id,movie_name,lead_actor)
  VALUES (${directorId},'${movie_name}','${lead_actor}');
  `
  await db.run(addMovieQuery)
  response.send('Movie Successfully Added')
})

app.get('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const getmovieQuery = `
  SELECT *
  FROM movie
  WHERE movie_id=${movieId};
  `
  const movie = await db.get(getmovieQuery)
  response.send(book)
})

app.put('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const movieDetails = request.body
  const {directorId, movie_name, lead_actor} = movieDetails
  const updateMovieQuery = `
  UPDATE movie 
  SET director_id=${directorId},
  movie_name=${movie_name},
  lead_actor=${lead_actor}
  WHERE movie_id=${movieId}
  `
  await db.run(updateMovieQuery)
  response.send('Movie Details Updated')
})

app.delete('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const deleteQuery = `
  DELETE FROM
  movie
  WHERE movie_id=${movieId};
  `
  await db.run(deleteQuery)
  response.send('Movie Removed')
})

app.get('/directors/', async (request, response) => {
  const getmoviesQuery = `
    SELECT *
    FROM director
    ORDER BY director_id;
    `
  const directorsArray = await db.all(getmoviesQuery)
  response.send(directorsArray)
})
