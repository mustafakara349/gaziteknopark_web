import logoImage from "../../assets/hero.png";

export default function BrandLogo({ className = "", alt = "Gazi Teknopark", ...props }) {
  return (
    <img
      src={logoImage}
      alt={alt}
      className={["h-10 w-auto shrink-0 object-contain", className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
