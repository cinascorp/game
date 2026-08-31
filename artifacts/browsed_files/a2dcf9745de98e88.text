import { cn } from "@/lib/utils";
import { RANK_LABEL, SUIT_LABEL, cardRank, cardSuit, isRed } from "@/lib/poker";

const SUIT_PATH: Record<string, string> = {
  s: "M12 2C12 2 4 9.2 4 14.2 4 17.8 6.7 20 9.5 20c1.6 0 2.5-.8 2.5-2 0 1.2.9 2 2.5 2 2.8 0 5.5-2.2 5.5-5.8C20 9.2 12 2 12 2z",
  h: "M12 21S3 14.4 3 8.8C3 5.6 5.5 3.5 8.2 3.5c1.8 0 3.3 1 3.8 2.4.5-1.4 2-2.4 3.8-2.4C18.5 3.5 21 5.6 21 8.8 21 14.4 12 21 12 21z",
  d: "M12 2L21 12 12 22 3 12z",
  c: "M12 12c0-3.2 2.2-5.5 5-5.5S22 8.8 22 12s-2.2 5.5-5 5.5c-1.2 0-2.2-.4-3-.1.4 1.4 1.6 3.6 4 4.1v1H6v-1c2.4-.5 3.6-2.7 4-4.1-.8-.3-1.8.1-3 .1-2.8 0-5-2.3-5-5.5S6.2 6.5 9 6.5 12 8.8 12 12z",
};

export function PlayingCard({
  card,
  hidden,
  size = "md",
}: {
  card?: number;
  hidden?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const dim =
    size === "lg" ? "w-16 h-[5.6rem]" : size === "sm" ? "w-9 h-[3.2rem]" : "w-12 h-[4.2rem]";
  if (hidden || card === undefined) {
    return (
      <div
        className={cn(
          dim,
          "rounded-sm border border-border bg-felt-deep shadow-sm relative overflow-hidden shrink-0",
        )}
      >
        <div className="absolute inset-[3px] rounded-[3px] border border-chip/40" />
        <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(135deg,transparent,transparent_4px,var(--color-chip)_4px,var(--color-chip)_5px)]" />
      </div>
    );
  }
  const rank = RANK_LABEL[cardRank(card)];
  const suit = SUIT_LABEL[cardSuit(card)];
  const red = isRed(card);
  return (
    <div
      className={cn(
        dim,
        "rounded-sm bg-card shadow-sm shrink-0 relative flex flex-col justify-between p-1",
        red ? "text-card-red" : "text-card-ink",
      )}
    >
      <div className="flex flex-col leading-none">
        <span className="text-[11px] font-semibold tabular-nums">{rank}</span>
        <svg viewBox="0 0 24 24" className="size-2.5 fill-current">
          <path d={SUIT_PATH[suit]} />
        </svg>
      </div>
      <svg viewBox="0 0 24 24" className="size-4 fill-current self-center">
        <path d={SUIT_PATH[suit]} />
      </svg>
    </div>
  );
}
