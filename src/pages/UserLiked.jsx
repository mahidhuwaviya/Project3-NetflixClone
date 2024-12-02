import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getUserLikedMovies } from "../store/index";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../utils/FirebaseConfig";
import NavBar from "../components/NavBar";

import Card from "../components/Card";

export default function MyList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentUserEmail, setCurrentUserEmail] = useState(undefined);
  const [isScrolled, setIsScrolled] = useState(false);
  const movies = useSelector((state) => state.netflix.movies);

  window.onscroll = () => {
    setIsScrolled(window.scrollY === 0 ? false : true);
    return () => (window.onscroll = null);
  };

  onAuthStateChanged(firebaseAuth, (currentUser) => {
    if (currentUser) {
      setCurrentUserEmail(currentUser.email);
    } else {
      navigate("/login");
    }
  });

  useEffect(() => {
    if (currentUserEmail) {
      dispatch(getUserLikedMovies(currentUserEmail));
    }
  }, [currentUserEmail, dispatch]);

  return (
    <div>
      <Container>
        <NavBar isScrolled={isScrolled} />
        <div className="content flex coloumn">
          <h1>My List</h1>
          <div className="grid flex">
            {movies &&
              movies.map((movie, index) => {
                return (
                  <Card
                    movieData={movie}
                    index={index}
                    key={movie.id}
                    isLiked={true}
                  />
                );
              })}
          </div>
        </div>
      </Container>
    </div>
  );
}

const Container = styled.div`
  .content {
    margin: 2.3rem;
    margin-top: 8rem;
    gap: 3rem;
    h1 {
      margin-left: 3rem;
    }
    .grid {
      flex-wrap: wrap;
      gap: 1rem;
    }
  }
`;
