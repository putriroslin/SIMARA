import styled from "styled-components";

const TitleText = styled.b`
  align-self: stretch;
  position: relative;
  letter-spacing: 0.03em;
  font-family: Lato;
`;

const Title = ({ text }) => {
  return (
    <>
      <TitleText>{text}</TitleText>
    </>
  );
};

export default Title;
