import React from "react";

const SendIcon = ({ width, height, color, strokeWidth }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 664 663"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

SendIcon.defaultProps = {
  width: "24", // Default width
  height: "24", // Default height
  color: "#fff", // Default color
  strokeWidth: "2", // Default stroke width
};

export default SendIcon;
