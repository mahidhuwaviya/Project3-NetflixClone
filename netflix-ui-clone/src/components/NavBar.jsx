import React, { useState } from "react";
import styled from "styled-components";
import LOGO from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaPowerOff } from "react-icons/fa";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../utils/FirebaseConfig";

export default function NavBar({ isScrolled }) {
  const navigate = useNavigate();
  const links = [
    { name: "HOME", link: "/" },
    { name: "TV Shows", link: "/tvShows" },
    { name: "MOVIE", link: "/movies" },
    { name: "MY LIST", link: "/myList" },
  ];
  const [showSearch, setShowSearch] = useState(false);
  const [inputHover, setInputHover] = useState(false);

  onAuthStateChanged(firebaseAuth, (currentUser) => {
    if (!currentUser) {
      navigate("/login");
    }
  });
  return (
    <>
      <Container>
        <nav className={`flex ${isScrolled ? "scrolled" : ""}`}>
          <div className="left flex a-center">
            <div className="brand flex a-center j-center">
              <img src={LOGO} alt="LOGO" />
            </div>
            <ul className="links flex">
              {links.map(({ name, link }, index) => {
                return (
                  <li key={index}>
                    <Link to={link}>{name}</Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="right flex a-center">
            <div className={`search ${showSearch ? "showSearch" : ""}`}>
              <button
                onFocus={() => {
                  setShowSearch(true);
                }}
                onBlur={() => {
                  if (!inputHover) setShowSearch(false);
                }}
              >
                <FaSearch />
              </button>
              <input
                type="text"
                placeholder="search"
                onMouseEnter={() => setInputHover(true)}
                onMouseLeave={() => setInputHover(false)}
                onBlur={() => {
                  setShowSearch(false);
                  setInputHover(false);
                }}
              />
            </div>
            <button
              onClick={() => {
                signOut(firebaseAuth);
              }}
            >
              <FaPowerOff />
            </button>
          </div>
        </nav>
      </Container>
    </>
  );
}

const Container = styled.div`
  .scrolled {
    background-color: black;
  }
  nav {
    position: sticky;
    top: 0;
    height: 6.5rem;
    width: 100%;
    justify-content: space-between;
    position: fixed;
    z-index: 2;
    padding: 0 4rem;
    align-items: center;
    transition: 0.3s ease-in-out;
    .left {
      gap: 2rem;
      .brand {
        img {
          height: 4rem;
        }
      }
      .links {
        list-style-type: none;
        gap: 2rem;
        li {
          a {
            color: white;
            text-decoration: none;
          }
        }
      }
    }

    .right {
      gap: 1rem;
      button {
        background-color: transparent;
        border: none;
        cursor: pointer;
        &:focus {
          outline: none;
        }
        svg {
          color: #f34242;
          font-size: 1.2rem;
        }
      }
      .search {
        display: flex;
        gap: 0.4rem;
        align-items: center;
        justify-content: center;
        padding: 0.2rem;
        padding-left: 0.5rem;
        button {
          background-color: transparent;
          svg {
            color: white;
          }
        }
        input {
          width: 0;
          opacity: 0;
          visibility: hidden;
          transition: 0.3s ease-in-out;
          background-color: transparent;
          border: none;
          color: white;
          &:focus {
            outline: none;
          }
        }
      }
      .showSearch {
        border: 1px solid white;
        background-color: rgba(0, 0, 0, 0.6);
        input {
          width: 100%;
          opacity: 1;
          visibility: visible;
          padding: 0.3rem;
        }
      }
    }
  }
`;
