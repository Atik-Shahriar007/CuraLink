import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="max-w-md mx-auto px-6 py-24 text-center">
      <WifiOff size={40} className="text-stone-400 mx-auto mb-4" />
      <h1 className="text-xl font-semibold mb-2">You&rsquo;re offline</h1>
      <p className="text-stone-500 text-sm">
        We couldn&rsquo;t reach CuraLink. Check your connection and try again — pages you&rsquo;ve
        already visited may still be available while you&rsquo;re offline.
      </p>
    </div>
  );
}
