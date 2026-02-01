import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6 text-red-500">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
      <p className="text-muted-foreground mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors">
        Return Home
      </Link>
    </div>
  );
}
