import { Link } from "react-router-dom";
import tcetLogo from "../assets/tcet-mumbai-logo.png";

export function Brand() {
  return (
    <Link className="brand" to="/" aria-label="TCET home">
      <img
        className="brand-logo"
        src={tcetLogo}
        alt="Thakur College of Engineering and Technology"
      />
    </Link>
  );
}
import "./../styles/pages/brand.css";
