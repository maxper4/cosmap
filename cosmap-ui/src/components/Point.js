function Point({ x, y, type, index }) {
  return (
    <span className="point" style={{ left: x+"px", top: y+"px", zIndex:1+index }}></span>
  );
}

export default Point;
