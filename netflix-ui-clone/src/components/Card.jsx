import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import video from "../assets/video.mp4";
import { IoPlayCircleSharp } from "react-icons/io5";
import { RiThumbUpFill, RiThumbDownFill } from "react-icons/ri";
import { BsCheck } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import { BiChevronDown } from "react-icons/bi";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../utils/FirebaseConfig";
import axios from "axios";
import { AddLikedMovesRoute } from "../utils/APIRoutes";
import { removeUserLikedMovies } from "../store/index";

export default function Card({ movieData, index, isLiked = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isHoverd, setIsHoverd] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState(undefined);

  onAuthStateChanged(firebaseAuth, (currentUser) => {
    if (currentUser) {
      setCurrentUserEmail(currentUser.email);
    } else {
      navigate("/login");
    }
  });

  const addToList = async () => {
    try {
      await axios.post(AddLikedMovesRoute, {
        email: currentUserEmail,
        data: movieData,
      });
    } catch (error) {
      console.log("Error from addToList:", error);
    }
  };

  return (
    <>
      <Container
        onMouseEnter={() => setIsHoverd(true)}
        onMouseLeave={() => setIsHoverd(false)}
      >
        <img
          src={`https://image.tmdb.org/t/p/w500/${movieData.image}`}
          alt=" movie"
        />
        {isHoverd && (
          <div className="hover">
            <div className="image-video-container">
              <img
                src={`https://image.tmdb.org/t/p/w500/${movieData.image}`}
                alt=" Movie"
                onClick={() => navigate("/player")}
              />
              <video
                src={video}
                autoPlay
                loop
                muted
                onClick={() => navigate("/player")}
              />
            </div>
            <div className="info-container flex coloumn">
              <h3 className="name" onClick={() => navigate("/player")}>
                {movieData.name}
              </h3>
              <div className="icons flex j-between">
                <div className="controls flex">
                  <IoPlayCircleSharp
                    title="play"
                    onClick={() => navigate("/player")}
                  />
                  <RiThumbUpFill title="like" />
                  <RiThumbDownFill title="dislike" />
                  {isLiked ? (
                    <BsCheck
                      title="Remove From Like"
                      onClick={() =>
                        dispatch(
                          removeUserLikedMovies({
                            email: currentUserEmail,
                            movie_id: movieData.id,
                          })
                        )
                      }
                    />
                  ) : (
                    <AiOutlinePlus title="Add to My List" onClick={addToList} />
                  )}
                </div>
                <div className="info">
                  <BiChevronDown title="more info" />
                </div>
              </div>
              <div className="genres flex">
                <ul className="flex">
                  {movieData.genres.map((genre, index) => (
                    <li key={genre}>{genre}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </Container>
    </>
  );
}

const Container = styled.div`
  max-width: 230px;
  width: 230px;
  height: 100%;
  cursor: pointer;
  position: relative;
  img {
    border-radius: 0.2rem;
    width: 100%;
    height: 100%;
    z-index: 10;
  }
  .hover {
    z-index: 90;
    height: max-content;
    width: 20rem;
    position: absolute;
    top: -18vh;
    left: 0;
    border-radius: 0.3rem;
    box-shadow: rgba(0, 0, 0, 0.75) 0px 3px 10px;
    background-color: #181818;
    transition: 0.3s ease-in-out;
    .image-video-container {
      position: relative;
      height: 140px;

      img {
        width: 100%;
        height: 140px;
        object-fit: cover;
        border-radius: 0.3rem;
        top: 0;
        z-index: 4;
        position: absolute;
      }
      video {
        height: 140px;
        width: 100%;
        object-fit: cover;
        border-radius: 0.3rem;
        top: 0;
        z-index: 5;
        position: absolute;
      }
    }
    .info-container {
      padding: 1rem;
      gap: 0.5rem;
      .icons {
        .controls {
          display: flex;
          gap: 1rem;
          svg {
            font-size: 2rem;
            cursor: pointer;
            transition: 0.3s ease-in-out;
            &:hover {
              color: #b8b8b8;
            }
          }
        }
      }
      .genres {
        ul {
          gap: 1rem;
          li {
            padding-right: 0.7rem;
            &:first-of-type {
              list-style: none;
            }
          }
        }
      }
    }
  }
`;
