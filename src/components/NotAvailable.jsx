import React from "react";
import styled from "styled-components";

export default function NotAvailable() {
  return (
    <Container>
      <h1 className="notAvailable">No Movies Available For Selected Genre</h1>
    </Container>
  );
}

const Container = styled.div`
  .notAvailable {
    text-align: center;
    color: white;
    margin-top: 4rem;
  }
`;
