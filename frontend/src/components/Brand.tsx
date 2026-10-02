import { Link } from "react-router-dom";

export function Brand() {
  return (
    <Link className="brand" to="/">
      <span className="brand-mark">
        C<span>/</span>
      </span>
      <span>
        CodeLab<span className="brand-x">X</span>
        <small>ACADEMIC LAB</small>
      </span>
    </Link>
  );
}
import "./../styles/pages/brand.css";
