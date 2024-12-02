import React from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { fetchMoviesByGenre } from "../store/index";

export default function SelectGenre({ genres, type }) {
  const dispatch = useDispatch();
  return (
    <div>
      <Select
        className="felx"
        onChange={(e) => {
          dispatch(fetchMoviesByGenre({ genre: e.target.value, type }));
        }}
      >
        {genres.map((genre, index) => {
          return (
            <option value={genre.id} key={index}>
              {genre.name}
            </option>
          );
        })}
      </Select>
    </div>
  );
}

const Select = styled.select`
  margin-left: 5rem;
  cursor: pointer;
  font-size: 1.4rem;
  background-color: rgba(0, 0, 0, 0.4);
  color: white;
`;
