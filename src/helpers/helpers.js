const getPortCoords = (port) => {
  const DIMENSIONS_DIVIDER = 2;
  return {
    left:
      port.group.left +
      (port.group.width / DIMENSIONS_DIVIDER + port.left) +
      port.radius,
    top:
      port.group.top +
      (port.group.height / DIMENSIONS_DIVIDER + port.top) +
      port.radius,
  };
};

export { getPortCoords };
