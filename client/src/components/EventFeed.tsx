import { useEvents, EventLog } from "@/hooks/use-events";
import { formatDistanceToNow } from "date-fns";
import { Loader2, Box, ExternalLink, RefreshCw } from "lucide-react";
import { clsx } from "clsx";

export function EventFeed() {
  const { events, isLoading, dbError } = useEvents();

  return (
    <div className="glass-panel rounded-2xl flex flex-col h-[500px] overflow-hidden">
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-card/30">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live Activity Feed
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time events indexed from Polygon Amoy
          </p>
        </div>
        
        {isLoading && <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />}
      </div>

      <div className="flex-1 overflow-y-auto p-0 relative">
        {dbError ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 text-red-500">
              <RefreshCw className="w-6 h-6" />
            </div>
            <p className="font-medium text-foreground mb-1">Connection Error</p>
            <p className="text-sm max-w-xs">{dbError}</p>
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              <Box className="w-8 h-8 opacity-50" />
            </div>
            <p className="font-medium">No events found</p>
            <p className="text-sm">Interact with the contract to generate activity.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {events.map((event, i) => (
              <EventRow key={event.id} event={event} isNew={i === 0} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EventRow({ event, isNew }: { event: EventLog; isNew: boolean }) {
  const shortAddr = `${event.user_address.slice(0, 6)}...${event.user_address.slice(-4)}`;
  
  return (
    <div className={clsx(
      "p-4 hover:bg-white/5 transition-colors flex items-center justify-between gap-4 group",
      isNew && "animate-in fade-in slide-in-from-top-2 duration-500 bg-primary/5"
    )}>
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center shrink-0">
          <span className="text-xs font-mono text-muted-foreground">0x</span>
        </div>
        
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded">
              {shortAddr}
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground" title={event.block_timestamp ? `Block time: ${new Date(event.block_timestamp).toUTCString()}` : 'DB time (fallback)'}>
              {formatDistanceToNow(new Date(event.block_timestamp || event.created_at), { addSuffix: true })}
              {!event.block_timestamp && <span className="text-yellow-500/70 ml-1">*</span>}
            </span>
          </div>
          <p className="text-sm font-medium mt-0.5 truncate text-foreground/90 group-hover:text-foreground transition-colors">
            {event.action}
          </p>
        </div>
      </div>

      <a 
        href={`https://amoy.polygonscan.com/address/${event.user_address}`} 
        target="_blank" 
        rel="noreferrer"
        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/10 rounded-lg text-muted-foreground hover:text-foreground"
        title="View on Explorer"
      >
        <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  );
}
