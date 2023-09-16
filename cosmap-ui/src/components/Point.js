function Point({ x, y, type, setMouseHover }) {
  return (
    <span className="point" style={{ left: x+"px", top: y+"px" }} onMouseEnter={(e) => setMouseHover(true)} onMouseLeave={(e) => setMouseHover(false)}></span>
  );
}

export default Point;
