import { useState, useEffect } from "react"
import Search from "./components/Search"
import { getTrendingMovies } from "./appwrite";
import MovieList from "./components/MovieList";


function App() {

  const [searchTerm, setSearchTerm] = useState('');
  const [trendingMovies, setTrendingMovies] = useState([]);


  const loadTrendingMovies = async() => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch(error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  }

  useEffect(() => {
    loadTrendingMovies();
  }, [])

  return (
    <main>
      <div className="pattern"/>
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>
        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2 className="mt-[60px]">Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}
        <MovieList searchTerm={searchTerm}/>
      </div>
    </main>
  )
}

export default App
