import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { fetchMovies, getGenres } from "../store/index";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../utils/FirebaseConfig";
import NavBar from "../components/NavBar";
import Slider from "../components/Slider";
import NotAvailable from "../components/NotAvailable";
import SelectGenre from "../components/SelectGenre";

export default function TVShows() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const genresLoaded = useSelector((state) => state.netflix.genresLoaded);
  const movies = useSelector((state) => state.netflix.movies);
  const genres = useSelector((state) => state.netflix.genres);
  console.log("genres from MOVIes,", genres);

  window.onscroll = () => {
    setIsScrolled(window.scrollY === 0 ? false : true);
    return () => (window.onscroll = null);
  };

  onAuthStateChanged(firebaseAuth, (currentUser) => {
    // if (currentUser) {
    //   navigate("/");
    // }
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGenres());
  }, []);

  useEffect(() => {
    if (genresLoaded) {
      dispatch(fetchMovies({ type: "tv" }));
    }
  }, [genresLoaded]);

  return (
    <div>
      <Container>
        <div className="navbar">
          <NavBar isScrolled={isScrolled} />
        </div>

        <div className="data">
          <SelectGenre genres={genres} type={"tv"} />
          {movies.length ? <Slider movies={movies} /> : <NotAvailable />}
        </div>
      </Container>
    </div>
  );
}

const Container = styled.div`
  .data {
    margin-top: 8rem;
  }
`;
