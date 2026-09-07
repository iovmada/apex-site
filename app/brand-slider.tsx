"use client";

import type { CSSProperties } from "react";
import { BRAND_STRIP, brandSupported } from "./data";

/** The brand strip that opens the fit finder.
 *
 *  This is a CSS marquee, not a carousel. It replaced an embla + auto-scroll
 *  setup: a one-directional infinite logo loop needs no slide model, no drag
 *  physics and no measuring, so the plugin was ~20KB of JS to translate a flex
 *  row. The track holds the brand list TWICE and slides exactly -50%, which
 *  lands the second copy where the first began — seamless, and it keeps
 *  animating off the main thread while React is busy.
 *
 *  The logos are also the brand step, not decoration. Picking one fills 01 /
 *  BRAND and unlocks the model select, which is a shorter path than opening the
 *  dropdown. Motion pauses on hover and focus-within so a moving target is
 *  never what you click, and stops outright under prefers-reduced-motion, where
 *  the strip becomes a plain scrollable row.
 *
 *  Marks render as masks over background-color rather than <img>, so one rule
 *  recolours them: full ink for a brand we cut for, faded for custom-only, acid
 *  on near-black once selected. An <img> of a black SVG can do none of that. */
export default function BrandSlider({
  lang,
  value,
  onPick,
  onCustom,
}: {
  lang: "en" | "ro";
  value: string;
  onPick: (make: string) => void;
  onCustom: () => void;
}) {
  const ro = lang === "ro";
  const t = (en: string, roText: string) => (ro ? roText : en);

  const plates = [0, 1].flatMap((copy) =>
    BRAND_STRIP.map((brand) => {
      const supported = brandSupported(brand.name),
        active = value === brand.name,
        clone = copy === 1;
      return (
        <li
          className="brand-slide"
          data-clone={clone || undefined}
          key={`${copy}-${brand.name}`}
        >
          <button
            type="button"
            className={
              "brand-plate" +
              (active ? " is-active" : "") +
              (supported ? "" : " is-custom")
            }
            // The clone exists only to make the loop seamless. Screen readers
            // and the tab order see the first copy only; a mouse can still
            // click the clone, which is why it keeps its handler.
            aria-hidden={clone || undefined}
            tabIndex={clone ? -1 : undefined}
            aria-pressed={supported ? active : undefined}
            onClick={() => (supported ? onPick(brand.name) : onCustom())}
            title={
              supported
                ? t(`Show ${brand.name} kits`, `Vezi kiturile ${brand.name}`)
                : t(
                    `No stock template for ${brand.name} yet — design a custom kit`,
                    `Încă nu avem șablon pentru ${brand.name} — creează un kit propriu`,
                  )
            }
          >
            {brand.logo ? (
              <span
                className="brand-mark"
                style={
                  {
                    "--mark": `url("/images/brands/${brand.logo}.svg")`,
                  } as CSSProperties
                }
              />
            ) : (
              // No artwork on hand: set the name in the heading face rather
              // than ship an invented logo.
              <span className="brand-word">{brand.name}</span>
            )}
            <span className="sr-only">
              {supported
                ? brand.name
                : t(
                    `${brand.name} — custom only`,
                    `${brand.name} — doar personalizat`,
                  )}
            </span>
          </button>
        </li>
      );
    }),
  );

  return (
    <div
      className="brand-band"
      role="group"
      aria-label={t("Pick your brand", "Alege marca")}
      // Once a brand is chosen the strip has done its job, so it stops: a
      // selection that drifts out of the band is worse than a still row.
      data-picked={value !== "All" || undefined}
    >
      <div className="brand-viewport">
        <ul className="brand-track">{plates}</ul>
      </div>
    </div>
  );
}
