import { Link } from "react-router-dom";
import { Button } from "./ui/Button";

interface NotFoundProps {
  title?: string;
  message?: string;
}

/**
 * Used both as the app-wide catch-all route (`*`) and directly by
 * ProfilePage when a `:address` param isn't a valid address — same
 * friendly "not found" treatment either way, just with different copy.
 */
export function NotFound({
  title = "Page not found",
  message = "The page you're looking for doesn't exist.",
}: NotFoundProps) {
  return (
    <div className="space-y-4 py-12 text-center">
      <p className="font-display text-5xl font-semibold text-line">404</p>
      <h1 className="font-display text-xl font-semibold text-ink">{title}</h1>
      <p className="text-slate">{message}</p>
      <Link to="/">
        <Button variant="secondary">Back to home</Button>
      </Link>
    </div>
  );
}
