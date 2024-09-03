import React from "react";
import { useParams } from "react-router-dom";

const TestParams = () => {
  const { id } = useParams();
  console.log("TestParams ID:", id);
  return <div>Test Params ID: {id}</div>;
};

export default TestParams;
