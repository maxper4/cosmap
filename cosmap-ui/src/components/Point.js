function Point({ x, y, type, index, setMouseHover }) {
  return (
    <span className="point" style={{ left: x+"px", top: y+"px", zIndex:1+index }} onMouseEnter={(e) => setMouseHover(true)} onMouseLeave={(e) => setMouseHover(false)}></span>
  );
}

export default Point;
