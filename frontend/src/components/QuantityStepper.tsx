import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

interface Props {
  productId: string;
  size?: "sm" | "md";
}

// Shows an "Add" button until the item is in the cart, then swaps to a
// -/qty/+ stepper. Used on the dashboard, store menu, and cart page so
// the quantity always reflects (and updates) the same shared cart.
export default function QuantityStepper({ productId, size = "sm" }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getQuantity, addToCart, setQuantity } = useCart();
  const quantity = getQuantity(productId);

  const dim = size === "sm" ? "1.75rem" : "2.25rem";
  const fontSize = size === "sm" ? ".75rem" : ".875rem";

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return navigate("/login");
    addToCart(productId);
  };

  const handleStep = (e: React.MouseEvent, delta: number) => {
    e.preventDefault();
    e.stopPropagation();
    setQuantity(productId, quantity + delta);
  };

  if (quantity <= 0) {
    return (
      <button
        onClick={handleAdd}
        className="btn btn-brand d-flex align-items-center justify-content-center rounded-3 fw-semibold"
        style={{ minWidth: "3.25rem", height: dim, fontSize, lineHeight: 1 }}
        aria-label="Add to cart"
      >
        Add
      </button>
    );
  }

  return (
    <div className="d-inline-flex align-items-center gap-2 rounded-3 bg-brand-50" style={{ padding: "0 .25rem" }}>
      <button
        onClick={(e) => handleStep(e, -1)}
        className="btn d-flex align-items-center justify-content-center rounded-2 border-0 bg-brand-600 text-white fw-bold p-0"
        style={{ width: dim, height: dim, fontSize: "1rem", lineHeight: 1 }}
        aria-label="Decrease quantity"
      >
        &minus;
      </button>
      <span className="fw-semibold text-brand-700" style={{ fontSize, minWidth: "1rem", textAlign: "center" }}>
        {quantity}
      </span>
      <button
        onClick={(e) => handleStep(e, 1)}
        className="btn d-flex align-items-center justify-content-center rounded-2 border-0 bg-brand-600 text-white fw-bold p-0"
        style={{ width: dim, height: dim, fontSize: "1rem", lineHeight: 1 }}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
