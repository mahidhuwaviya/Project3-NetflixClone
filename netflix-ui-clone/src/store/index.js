import {
  configureStore,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import { TMDB_BASE_URL, API_KEY } from "../utils/Constants";
import axios from "axios";
import { GetLikedMovesRoute, RemoveLikedMovesRoute } from "../utils/APIRoutes";

const initialState = {
  movies: [],
  genresLoaded: false,
  genres: [],
};

export const getGenres = createAsyncThunk("netflix/genres", async () => {
  const {
    data: { genres },
  } = await axios.get(`${TMDB_BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
  //   console.log("datatype genres from getGenres:", genres);
  return genres;
});

// const createArrayFromRawData = (results, moviesArray, genres) => {
//   results.forEach((movie) => {
//     // console.log("MOVIES???:", movie);
//     const movieGenres = [];
//     movie.genre_ids.forEach((genre) => {
//       const name = genres.find(({ id }) => id === genre);
//       //   console.log("name from createArrayFromRawData: ", name);
//       //   console.log("name.name from createArrayFromRawData: ", name.name);

//       if (name) {
//         movieGenres.push(name.name);
//       }
//       //   console.log(
//       //     "movie.backdrop_path from createArrayFromRawData: ",
//       //     movie.backdrop_path
//       //   );

//       if (movie.backdrop_path) {
//         moviesArray.push({
//           id: movie.id,
//           name: movie.original_name
//             ? movie.original_name
//             : movie.original_title,
//           image: movie.backdrop_path,
//           genres: movieGenres.slice(0, 3),
//         });
//       }
//     });
//   });
// };

// const getRawData = async (api, genres, paging) => {
//   const moviesArray = [];
//   for (let i = 1; moviesArray.length < 60 && i < 20; i++) {
//     let url = api;
//     if (paging) {
//       url = `${api}&page=${i}`;
//     }
//     console.log(url);
//     const {
//       data: { results },
//     } = await axios.get(url);
//     // console.log("data results/array from rawdata:", results);
//     createArrayFromRawData(results, moviesArray, genres);
//     // console.log("data2 /array from  createArrayFromRawData rawdata:", data2);

//     return moviesArray;
//   }
// };

const createArrayFromRawData = (results, moviesArray, genres) => {
  const uniqueMovies = new Set(moviesArray.map((movie) => movie.id));
  results.forEach((movie) => {
    if (!uniqueMovies.has(movie.id)) {
      const movieGenres = [];
      movie.genre_ids.forEach((genre) => {
        const name = genres.find(({ id }) => id === genre);
        if (name) {
          movieGenres.push(name.name);
        }
      });
      if (movie.backdrop_path) {
        moviesArray.push({
          id: movie.id,
          name: movie.original_name
            ? movie.original_name
            : movie.original_title,
          image: movie.backdrop_path,
          genres: movieGenres.slice(0, 3),
        });
        uniqueMovies.add(movie.id); // Add to uniqueMovies set
      }
    }
  });
};

const getRawData = async (api, genres, paging) => {
  const moviesArray = [];
  for (let i = 1; moviesArray.length < 60 && i < 20; i++) {
    const url = `${api}${paging ? `&page=${i}` : "/"}`;

    try {
      const {
        data: { results },
      } = await axios.get(url);
      createArrayFromRawData(results, moviesArray, genres);
      if (moviesArray.length >= 60) break;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  return moviesArray;
};

export const fetchMoviesByGenre = createAsyncThunk(
  "netflix/moviesByGenre",
  async ({ genre, type }, thunkApi) => {
    const {
      netflix: { genres },
    } = thunkApi.getState();
    console.log("Netflix slice genres:", genres);
    return await getRawData(
      `${TMDB_BASE_URL}/discover/${type}?api_key=${API_KEY}&with_genres=${genre}`,
      genres,
      true
    );
  }
);

export const fetchMovies = createAsyncThunk(
  "netflix/trending",
  async ({ type }, thunkApi) => {
    const {
      netflix: { genres },
    } = thunkApi.getState();
    return await getRawData(
      `${TMDB_BASE_URL}/trending/${type}/week?api_key=${API_KEY}`,
      genres,
      true
    );
  }
);

export const getUserLikedMovies = createAsyncThunk(
  "netflix/getliked",
  async (email) => {
    const {
      data: { movies },
    } = await axios.get(`${GetLikedMovesRoute}/${email}`);
    return movies;
  }
);

export const removeUserLikedMovies = createAsyncThunk(
  "netflix/removeliked",
  async ({ email, movie_id }) => {
    console.log("functionstarted");

    const {
      data: { movies },
    } = await axios.delete(RemoveLikedMovesRoute, {
      data: { email, movie_id },
    });
    console.log("functionstartedended//");

    console.log(movie_id);
    console.log(email);
    console.log(movies);
    return movies;
  }
);

const NetflixSlice = createSlice({
  name: "Netflix",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getGenres.fulfilled, (state, action) => {
      state.genres = action.payload;
      state.genresLoaded = true;
    });
    builder.addCase(fetchMovies.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
    builder.addCase(fetchMoviesByGenre.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
    builder.addCase(getUserLikedMovies.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
    builder.addCase(removeUserLikedMovies.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
  },
});

export const store = configureStore({
  reducer: {
    netflix: NetflixSlice.reducer,
  },
});
