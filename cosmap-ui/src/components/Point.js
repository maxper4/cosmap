function Point({ x, y, type }) {
  return (
    <span className="point" style={{ left: x, top: 482-y }}></span>
  );
}

export default Point;
