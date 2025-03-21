import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import MovieCard from "./MovieCard";
import { useDebounce } from "react-use";
import { updateSearchCount } from "../appwrite";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

export default function MovieList({ searchTerm }) {
  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");


  useDebounce(() => setDebouncedSearchTerm(searchTerm), 600, [searchTerm]);

  useEffect(() => {
    const fetchMovies = async (query = '') => {
      setIsLoading(true);
      setErrorMessage("");
      
      try {
        const endpoint = query
          ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
          : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

        const response = await fetch(endpoint, API_OPTIONS);

        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }

        const data = await response.json();

        if (data.Response === "False") {
          setErrorMessage(data.Error || "Failed to fetch movies");
          setMovieList([]);
          return;
        }

        setMovieList(data.results || []);

        if (query && data.results.length > 0) {
            await updateSearchCount(query, data.results[0]);

            setTimeout(() => {
                window.scrollTo({
                  top: document.querySelector(".all-movies")?.offsetTop || 0,
                  behavior: "smooth",
                });
            }, 300);
        }
      } catch (error) {
        console.log(`Error Fetching Movies: ${error}`);
        setErrorMessage("Error Fetching Movies. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <section className="all-movies">
      <h2 className="mt-[20px]">All Movies</h2>
      {isLoading ? (
        <Spinner />
      ) : errorMessage ? (
        <p className="text-red-500">{errorMessage}</p>
      ) : (
        <ul>
          {movieList.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </ul>
      )}
    </section>
  );
}
