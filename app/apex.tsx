"use client";
import { useState, useEffect, useRef, useId } from "react";
import { flushSync } from "react-dom";
import BrandSlider from "./brand-slider";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Check,
  ShieldCheck,
  Truck,
  Menu,
  Sun,
  Moon,
  Plus,
  Minus,
  Trash2,
  Download,
  X,
  SlidersHorizontal,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import {
  KITS,
  MODELS,
  MODEL_TYPES,
  modelYears,
  COLORS,
  FINISHES,
  extra,
  filterKits,
  defaultFilters,
  type Kit,
  type Filters,
} from "./data";

type Line = { key: string; kit: Kit; finish: string; qty: number };
type T = (en: string, ro: string) => string;
function Picker({
  label,
  value,
  items,
  onChange,
  disabled,
  className = "",
}: {
  label: string;
  value: string;
  items: { value: string; label: string }[];
  onChange: (v: string) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div className={"picker " + className}>
      <span>{label}</span>
      <Select
        items={items}
        value={value}
        onValueChange={(v) => v && onChange(v)}
        disabled={disabled}
      >
        <SelectTrigger
          aria-label={label}
          className="picker-trigger"
          disabled={disabled}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="select-popup">
          {items.map((i) => (
            <SelectItem className="select-option" key={i.value} value={i.value}>
              {i.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
function Choices({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string; color?: string }[];
  onChange: (v: string) => void;
}) {
  const id = useId();
  return (
    <RadioGroup
      aria-label={label}
      className={"choices " + (options[0]?.color ? "swatches" : "")}
      value={value}
      onValueChange={(v) => onChange(String(v))}
    >
      {options.map((o) => (
        <label
          key={o.value}
          className={"choice " + (value === o.value ? "selected" : "")}
          title={o.label}
          style={
            o.color
              ? ({ "--swatch": o.color } as React.CSSProperties)
              : undefined
          }
        >
          <RadioGroupItem
            value={o.value}
            aria-label={o.label}
            id={id + o.value}
            className="choice-radio"
          />
          <span>
            {o.color ? value === o.value ? <Check size={18} /> : null : o.label}
          </span>
        </label>
      ))}
    </RadioGroup>
  );
}
function download(name: string, text: string) {
  const url = URL.createObjectURL(
    new Blob([text], { type: "text/plain;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export default function Apex({
  initialShop = false,
}: {
  initialShop?: boolean;
}) {
  const [lang, setLang] = useState<"en" | "ro">("en"),
    [light, setLight] = useState(false),
    [shop, setShop] = useState(initialShop),
    [menu, setMenu] = useState(false),
    [cartOpen, setCartOpen] = useState(false),
    [cart, setCart] = useState<Line[]>([]),
    [product, setProduct] = useState<Kit | null>(null),
    [finish, setFinish] = useState("Gloss"),
    [filters, setFilters] = useState<Filters>(defaultFilters),
    [year, setYear] = useState("All"),
    [showFilters, setShowFilters] = useState(false),
    [color, setColor] = useState("Volt"),
    [pattern, setPattern] = useState("Geometric"),
    [customFinish, setCustomFinish] = useState("Gloss"),
    [briefOpen, setBriefOpen] = useState(false),
    [ride, setRide] = useState(""),
    [notes, setNotes] = useState(""),
    [notice, setNotice] = useState("");
  const t: T = (en, ro) => (lang === "ro" ? ro : en);
  const shown = filterKits(filters),
    count = cart.reduce((n, l) => n + l.qty, 0),
    subtotal = cart.reduce(
      (n, l) => n + (l.kit.base + extra(l.finish)) * l.qty,
      0,
    ),
    estimate = 249 + extra(customFinish) + (pattern === "Minimal" ? 0 : 20);
  const cats = [
    { value: "All", label: t("All wraps", "Toate kiturile") },
    { value: "ATV", label: "ATV" },
    { value: "MX", label: "Enduro & MX" },
    { value: "Street", label: t("Street bikes", "Stradă") },
    { value: "Board", label: "Snowboard" },
  ];
  const fLabel = (f: string) =>
    f === "Gloss"
      ? t("Gloss", "Lucios")
      : f === "Matte"
        ? t("Matte", "Mat")
        : f;
  function navigate(toShop: boolean, hash = "") {
    setShop(toShop);
    setMenu(false);
    window.history.pushState({}, "", toShop ? "/shop" : "/" + hash);
    if (hash)
      setTimeout(
        () =>
          document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" }),
        30,
      );
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function goShop(type = "All") {
    setFilters({ ...defaultFilters, type });
    navigate(true);
  }
  function update(k: keyof Filters, v: string) {
    setFilters((f) => ({
      ...f,
      [k]: v,
      ...(k === "make" ? { model: "All" } : {}),
    }));
  }
  function openProduct(k: Kit) {
    setProduct(k);
    setFinish(k.id === "k9" ? "Carbon" : "Gloss");
  }
  function add() {
    if (!product) return;
    const key = product.id + finish;
    setCart((c) => {
      const old = c.find((l) => l.key === key);
      return old
        ? c.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l))
        : [...c, { key, kit: product, finish, qty: 1 }];
    });
    setProduct(null);
    setCartOpen(true);
  }
  function reset() {
    setFilters(defaultFilters);
    setYear("All");
  }
  /** Clears only the ride, keeping any colour/finish narrowing the rider set
   *  on the shop page — that's what the fit chip's dismiss means. */
  function clearRide() {
    setFilters((f) => ({ ...f, type: "All", make: "All", model: "All" }));
    setYear("All");
  }
  function saveBrief() {
    download(
      "apex-custom-wrap-brief.txt",
      `APEX WRAP LAB — CUSTOM WRAP BRIEF\n\nVehicle: ${ride || "To be confirmed"}\nColour: ${color}\nGraphic style: ${pattern}\nFinish: ${customFinish}\nEstimated kit price: ${estimate} lei\nNotes: ${notes || "None"}\n\nThis is a design brief, not an order. Fitment and final artwork must be confirmed with Apex Wrap Lab.`,
    );
    setNotice(
      t(
        "Your design brief has been downloaded.",
        "Brief-ul tău a fost descărcat.",
      ),
    );
  }
  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem("apex-preferences") || "{}");
      if (p.lang === "ro") setLang("ro");
      if (p.light) setLight(true);
    } catch {}
    const pop = () => setShop(window.location.pathname.startsWith("/shop"));
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.className = light ? "light" : "dark";
    try {
      localStorage.setItem("apex-preferences", JSON.stringify({ lang, light }));
    } catch {}
  }, [lang, light]);
  useEffect(() => {
    document.title = shop
      ? t("All wrap kits — Apex Wrap Lab", "Toate kiturile — Apex Wrap Lab")
      : t(
          "Apex Wrap Lab — Make your mark.",
          "Apex Wrap Lab — Lasă-ți amprenta.",
        );
  }, [shop, lang]);
  const live = useRef({ filters });
  live.current = { filters };
  useEffect(() => {
    type Context = {
      registerTool: (
        tool: Record<string, unknown>,
        options: { signal: AbortSignal },
      ) => void | Promise<void>;
    };
    const context = (document as Document & { modelContext?: Context })
      .modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const register = (tool: Record<string, unknown>) => {
      try {
        Promise.resolve(
          context.registerTool(tool, { signal: lifecycle.signal }),
        ).catch(() => {});
      } catch {}
    };
    register({
      name: "filter_wrap_kits",
      description:
        "Filter the wrap catalog by vehicle type and brand and show matching kits. Does not guarantee exact model/year fitment or place an order.",
      inputSchema: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: ["All", "ATV", "MX", "Street", "Board"],
          },
          make: { type: "string", enum: ["All", ...Object.keys(MODELS)] },
        },
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: (input: unknown) => {
        if (!input || typeof input !== "object" || Array.isArray(input))
          throw new Error("Expected filter object");
        const p = input as Record<string, unknown>;
        if (Object.keys(p).some((k) => !["type", "make"].includes(k)))
          throw new Error("Unknown filter");
        if (
          p.type !== undefined &&
          !["All", "ATV", "MX", "Street", "Board"].includes(String(p.type))
        )
          throw new Error("Invalid vehicle type");
        if (
          p.make !== undefined &&
          !["All", ...Object.keys(MODELS)].includes(String(p.make))
        )
          throw new Error("Invalid brand");
        const f = {
          ...defaultFilters,
          type: String(p.type ?? "All"),
          make: String(p.make ?? "All"),
        };
        flushSync(() => {
          setFilters(f);
          setShop(true);
        });
        window.history.pushState({}, "", "/shop");
        return {
          kits: filterKits(f).map((k) => ({
            id: k.id,
            name: k.name,
            basePriceLei: k.base,
          })),
          fitment: "Exact model and year require confirmation",
        };
      },
    });
    register({
      name: "read_visible_wrap_kits",
      description:
        "Read the current kit filters and matching product names and base prices.",
      inputSchema: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute: (input: unknown) => {
        if (!input || typeof input !== "object" || Object.keys(input).length)
          throw new Error("Expected an empty object");
        return {
          filters: live.current.filters,
          kits: filterKits(live.current.filters).map((k) => ({
            id: k.id,
            name: k.name,
            basePriceLei: k.base,
          })),
        };
      },
    });
    return () => lifecycle.abort();
  }, []);
  const all = (label: string) => ({ value: "All", label });
  const options = (xs: string[]) =>
    xs.map((value) => ({ value, label: value }));
  const navLink = (label: string, id: string) => (
    <a
      href={"/#" + id}
      onClick={(e) => {
        e.preventDefault();
        navigate(false, "#" + id);
      }}
    >
      {label}
    </a>
  );
  const renderProduct = (k: Kit) => (
    <button className="product" onClick={() => openProduct(k)} key={k.id}>
      <div className="product-photo">
        {k.img ? (
          <img src={k.img} alt={k.name + " — " + k.cat} loading="lazy" />
        ) : (
          <div
            className="product-typecard"
            style={{ "--kit-color": k.b } as React.CSSProperties}
          >
            <span>APEX / {k.type.toUpperCase()}</span>
            <strong>{k.name.toUpperCase()}</strong>
            <span>
              {k.color} / {k.style}
            </span>
          </div>
        )}
        <span className="product-tag">
          {k.hot
            ? t("RIDER FAVOURITE", "PREFERAT DE PILOȚI")
            : k.cat.toUpperCase()}
        </span>
        <span className="product-arrow">
          <ArrowUpRight size={21} />
        </span>
      </div>
      <div className="product-info">
        <h3>{k.name}</h3>
        <span>
          {t("From", "De la")} <b>{k.base + (k.id === "k9" ? 60 : 0)} lei</b>
        </span>
      </div>
      <div className="product-meta">
        <span className="tiny-swatch" style={{ background: k.b }} />
        {k.cat} <span> / </span>
        {k.style}
      </div>
    </button>
  );
  // Steps unlock in order: model needs a brand, year needs a model. A locked
  // trigger states its own reason instead of opening an empty menu.
  const modelLocked = filters.make === "All",
    yearLocked = filters.model === "All",
    fitReady = !modelLocked && !yearLocked,
    fitCount = shown.length,
    // A confirmed ride with nothing to show is a dead end, so the CTA becomes
    // the Custom Lab route rather than a link to an empty grid.
    noFit = fitReady && fitCount === 0;
  const finder = (
    <div className="finder">
      <BrandSlider
        lang={lang}
        value={filters.make}
        onPick={(make) => {
          update("make", make);
          setYear("All");
        }}
        onCustom={() => navigate(false, "#custom")}
      />
      <div className="finder-head">
        <div className="eyebrow">{t("FIND YOUR FIT", "GĂSEȘTE KITUL TĂU")}</div>
        <h2>{t("WHAT DO YOU RIDE?", "CE CONDUCI?")}</h2>
      </div>
      <div className="finder-row">
        <Picker
          label={t("01 / BRAND", "01 / MARCĂ")}
          value={filters.make}
          items={[
            all(t("Select brand", "Alege marca")),
            ...options(Object.keys(MODELS)),
          ]}
          onChange={(v) => {
            update("make", v);
            setYear("All");
          }}
        />
        <Picker
          label={t("02 / MODEL", "02 / MODEL")}
          value={filters.model}
          disabled={modelLocked}
          items={[
            all(
              modelLocked
                ? t("Pick a brand first", "Alege întâi marca")
                : t("Select model", "Alege modelul"),
            ),
            ...options(MODELS[filters.make] || []),
          ]}
          onChange={(v) => {
            update("model", v);
            setYear("All");
          }}
        />
        <Picker
          className="picker-year"
          label={t("03 / YEAR", "03 / AN")}
          value={year}
          disabled={yearLocked}
          items={[
            all(
              yearLocked
                ? t("Pick a model first", "Alege întâi modelul")
                : t("Select year", "Alege anul"),
            ),
            ...options(modelYears(filters.model)),
          ]}
          onChange={setYear}
        />
        <button
          className="button finder-cta"
          disabled={!fitReady}
          onClick={() => {
            if (noFit) return navigate(false, "#custom");
            navigate(true);
            setFilters((f) => ({
              ...f,
              type: f.model === "All" ? "All" : MODEL_TYPES[f.model],
            }));
          }}
        >
          {!fitReady
            ? t("Find my kit", "Găsește kitul")
            : noFit
              ? t("Design a custom kit", "Creează un kit propriu")
              : fitCount === 1
                ? t("Show 1 kit", "Vezi 1 kit")
                : t(`Show ${fitCount} kits`, `Vezi ${fitCount} kituri`)}
          <ArrowRight size={18} />
        </button>
      </div>
      <div className="finder-fit">
        {fitReady ? (
          <>
            <span className="finder-fit-chip">
              <Check size={14} />
              {filters.make} {filters.model}
              {year !== "All" ? " \u00b7 " + year : ""}
              <button
                onClick={clearRide}
                aria-label={t("Clear your ride", "Șterge selecția")}
              >
                <X size={13} />
              </button>
            </span>
            <span className="finder-fit-note">
              {noFit
                ? t(
                    "No stock design is cut for this ride yet — the Custom Lab builds one to your panels.",
                    "Nu avem încă un design de serie pentru această combinație — Custom Lab îl construiește pe panourile tale.",
                  )
                : t(
                    "These designs match your brand and vehicle category. Exact panel fitment is confirmed against your model year before we cut.",
                    "Aceste designuri corespund mărcii și categoriei tale. Potrivirea exactă a panourilor se confirmă pentru anul modelului înainte de tăiere.",
                  )}
            </span>
          </>
        ) : (
          <span className="finder-fit-note">
            {t(
              "Pick your brand and model — we only show kits we hold a cut template for.",
              "Alege marca și modelul — arătăm doar kiturile pentru care avem șablon de tăiere.",
            )}
          </span>
        )}
        <button
          className="finder-fit-link"
          onClick={() => navigate(false, "#custom")}
        >
          {t("Year not listed?", "Anul nu apare?")}
        </button>
      </div>
    </div>
  );
  return (
    <>
      <a className="skip-link" href="#main">
        {t("Skip to content", "Sari la conținut")}
      </a>
      <div className="announcement">
        <span>
          {t("PRECISION CUT. RIDE READY.", "TĂIAT PRECIS. GATA DE DRUM.")}
        </span>
        <span>
          {t(
            "Free shipping on orders over 350 lei",
            "Livrare gratuită la comenzi peste 350 lei",
          )}{" "}
          <ArrowUpRight size={13} />
        </span>
        <span>DESIGNED IN CLUJ, RO</span>
      </div>
      <header className="header">
        <a
          className="logo"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate(false);
          }}
          aria-label="Apex Wrap Lab home"
        />
        <nav aria-label={t("Main navigation", "Navigare principală")}>
          <a
            href="/shop"
            onClick={(e) => {
              e.preventDefault();
              goShop();
            }}
          >
            {t("Shop wraps", "Magazin")}
          </a>
          {navLink(t("Custom lab", "Personalizare"), "custom")}
          {navLink(t("The riders", "Piloții"), "riders")}
          {navLink(t("Our craft", "Despre noi"), "about")}
        </nav>
        <div className="header-actions">
          <div className="lang-switch">
            <button aria-pressed={lang === "en"} onClick={() => setLang("en")}>
              EN
            </button>
            <span>/</span>
            <button aria-pressed={lang === "ro"} onClick={() => setLang("ro")}>
              RO
            </button>
          </div>
          <button
            className="icon-button theme-button"
            aria-label={t(
              light ? "Use dark theme" : "Use light theme",
              light ? "Temă întunecată" : "Temă luminoasă",
            )}
            onClick={() => setLight(!light)}
          >
            {light ? <Moon size={17} /> : <Sun size={17} />}
          </button>
          <button
            className="bag"
            onClick={() => setCartOpen(true)}
            aria-label={t(
              `Open bag, ${count} items`,
              `Deschide coșul, ${count} produse`,
            )}
          >
            <ShoppingBag size={19} />
            <span>
              {t("Bag", "Coș")} ({count})
            </span>
          </button>
          <button
            className="icon-button menu-button"
            aria-label={t("Open navigation", "Deschide meniul")}
            onClick={() => setMenu(true)}
          >
            <Menu size={22} />
          </button>
        </div>
      </header>
      <main id="main">
        {!shop ? (
          <>
            <section className="hero" id="top">
              <img
                className="hero-photo"
                src="/images/hero-motocross-graphics-kit.jpg"
                alt={t(
                  "Custom motocross graphics kit in black and volt yellow — a precision-cut Apex Wrap Lab vinyl wrap on an enduro dirt bike in the workshop",
                  "Kit de grafică motocross personalizat, negru cu galben neon — folie vinil decupată la precizie Apex Wrap Lab pe o motocicletă enduro, în atelier",
                )}
                fetchPriority="high"
              />
              <div className="hero-shade" />
              <div className="hero-content">
                <div className="eyebrow">
                  <span className="dot" />{" "}
                  {t(
                    "BUILT FOR THE ONES WHO RIDE.",
                    "PENTRU CEI CARE TRĂIESC SĂ CONDUCĂ.",
                  )}
                </div>
                <h1>
                  {t("YOUR RIDE.", "STILUL TĂU.")}
                  <br />
                  <em>{t("YOUR RULES.", "REGULILE TALE.")}</em>
                </h1>
                <p>
                  {t(
                    "Precision-cut wrap kits. Unmistakably you.",
                    "Kituri de wrap tăiate precis. Inconfundabil tu.",
                  )}
                  <br />
                  {t(
                    "From the starting gate to the streets.",
                    "De la grila de start până pe stradă.",
                  )}
                </p>
                <div className="hero-buttons">
                  <button className="button yellow" onClick={() => goShop()}>
                    {t("Find your wrap", "Găsește-ți kitul")}{" "}
                    <ArrowUpRight size={20} />
                  </button>
                  <a className="button outline" href="#custom">
                    {t("Create your own", "Creează-l pe al tău")}{" "}
                    <ArrowUpRight size={20} />
                  </a>
                </div>
                <div className="hero-proof">
                  <span className="stars" aria-label="5 stars">
                    ★★★★★
                  </span>
                  <a href="#riders">
                    {t("4.8/5 from 312 riders", "4,8/5 de la 312 piloți")}
                  </a>
                </div>
              </div>
              <div className="hero-coordinate">
                <span>{t("THE 2026 COLLECTION", "COLECȚIA 2026")}</span>
                <span>
                  {t("01 — MADE TO BE SEEN", "01 — FĂCUT SĂ IEȘI ÎN EVIDENȚĂ")}
                </span>
              </div>
            </section>
            <section
              className="promise-bar"
              aria-label={t("Wrap kit benefits", "Avantajele kiturilor")}
            >
              <span>
                <ShieldCheck />
                {t("Guaranteed fit", "Potrivire garantată")}
              </span>
              <span>
                <b>3M</b>
                {t("Premium cast film", "Folie turnată premium")}
              </span>
              <span>
                <Truck />
                {t("Dispatched in 48h", "Expediere în 48h")}
              </span>
              <span>
                <Check />
                {t("Ride-ready in 2 hours", "Montaj în 2 ore")}
              </span>
            </section>
            <div className="finder-wrap finder-band">{finder}</div>
            <section className="section collection">
              <div className="section-head">
                <div>
                  <div className="eyebrow muted">
                    {t("01 / THE COLLECTION", "01 / COLECȚIA")}
                  </div>
                  <h2>{t("MAKE YOUR MARK.", "LASĂ-ȚI AMPRENTA.")}</h2>
                </div>
                <a
                  className="text-link"
                  href="/shop"
                  onClick={(e) => {
                    e.preventDefault();
                    goShop();
                  }}
                >
                  {t("Shop all wraps", "Vezi toate kiturile")}{" "}
                  <ArrowUpRight size={18} />
                </a>
              </div>
              <div className="category-links">
                {cats.slice(1).map((c) => (
                  <button key={c.value} onClick={() => goShop(c.value)}>
                    {c.label}
                    <ArrowUpRight size={16} />
                  </button>
                ))}
              </div>
              <div className="product-grid">
                {KITS.slice(0, 4).map(renderProduct)}
              </div>
            </section>
            <section className="section" id="custom">
              <div className="custom-grid">
                <div className="custom-photo">
                  <img
                    src="/images/config-base.jpg"
                    alt={t(
                      "Unwrapped motorcycle ready for a custom design",
                      "Motocicletă pregătită pentru un design personalizat",
                    )}
                    loading="lazy"
                  />
                  <div className="custom-photo-top">
                    <span className="eyebrow">APEX / CUSTOM LAB</span>
                    <span className="cross-mark">+</span>
                  </div>
                  <div className="custom-photo-bottom">
                    <span>
                      {t(
                        "A blank canvas. Your next signature.",
                        "O pânză goală. Următoarea ta semnătură.",
                      )}
                    </span>
                    <span
                      className="chosen-color"
                      style={{
                        background: COLORS.find((c) => c.n === color)?.hex,
                      }}
                    />
                  </div>
                </div>
                <div className="custom-panel">
                  <div className="eyebrow muted">
                    {t("02 / ONE OF ONE", "02 / UNIC, CA TINE")}
                  </div>
                  <h2>
                    {t("NO TWO RIDERS.", "NICIUN PILOT.")}
                    <br />
                    <em>{t("NO TWO WRAPS.", "NICIUN WRAP LA FEL.")}</em>
                  </h2>
                  <p>
                    {t(
                      "Your colours. Your graphics. Your finish. Start with an idea and make it yours.",
                      "Culorile, grafica și finisajul tău. Începe cu o idee și fă-o a ta.",
                    )}
                  </p>
                  <div className="config-control">
                    <div className="control-title">
                      <span>{t("Base colour", "Culoare de bază")}</span>
                      <span>{color}</span>
                    </div>
                    <Choices
                      label={t("Base colour", "Culoare de bază")}
                      value={color}
                      options={COLORS.slice(0, 5).map((c) => ({
                        value: c.n,
                        label: c.n,
                        color: c.hex,
                      }))}
                      onChange={setColor}
                    />
                  </div>
                  <div className="config-control">
                    <div className="control-title">
                      <span>{t("Graphic style", "Stil grafic")}</span>
                    </div>
                    <Choices
                      label={t("Graphic style", "Stil grafic")}
                      value={pattern}
                      options={options([
                        "Racing",
                        "Geometric",
                        "Camo",
                        "Minimal",
                      ])}
                      onChange={setPattern}
                    />
                  </div>
                  <div className="config-control">
                    <div className="control-title">
                      <span>{t("Finish", "Finisaj")}</span>
                    </div>
                    <Choices
                      label={t("Finish", "Finisaj")}
                      value={customFinish}
                      options={FINISHES.map((f) => ({
                        value: f,
                        label: fLabel(f),
                      }))}
                      onChange={setCustomFinish}
                    />
                  </div>
                  <div className="config-bottom">
                    <div>
                      <span>{t("Estimated kit price", "Preț estimat")}</span>
                      <strong>
                        {estimate} <small>lei</small>
                      </strong>
                    </div>
                    <button
                      className="button yellow"
                      onClick={() => {
                        setNotice("");
                        setBriefOpen(true);
                      }}
                    >
                      {t("Build my brief", "Creează brief-ul")}
                      <ArrowUpRight size={18} />
                    </button>
                  </div>
                  <p className="fine-print">
                    {t(
                      "Selections form your design brief. Final artwork and fitment are confirmed with the lab.",
                      "Opțiunile alcătuiesc brief-ul tău. Grafica finală și potrivirea se confirmă cu echipa.",
                    )}
                  </p>
                </div>
              </div>
            </section>
            <section className="section craft" id="about">
              <div className="section-head">
                <div>
                  <div className="eyebrow muted">
                    {t("03 / BUILT DIFFERENT", "03 / FĂCUT ALTFEL")}
                  </div>
                  <h2>{t("LOOKS THAT LAST.", "STIL CARE REZISTĂ.")}</h2>
                </div>
                <p>
                  {t(
                    "Designed in Cluj. Made for the ride.",
                    "Proiectat în Cluj. Făcut pentru drum.",
                  )}
                  <br />
                  {t(
                    "Every detail earns its place.",
                    "Fiecare detaliu contează.",
                  )}
                </p>
              </div>
              <div className="craft-grid">
                {[
                  {
                    n: "01",
                    value: "3M",
                    title: t("The real material.", "Materialul original."),
                    body: t(
                      "IJ180Cv3 cast vinyl with 8518 gloss overlaminate. Rich colour, air-release adhesive, a finish made to last.",
                      "Vinil turnat IJ180Cv3 cu laminare lucioasă 8518. Culori intense, adeziv cu canale de aer și un finisaj rezistent.",
                    ),
                  },
                  {
                    n: "02",
                    value: "100%",
                    title: t(
                      "A fit, not a guess.",
                      "Potrivire, nu presupuneri.",
                    ),
                    body: t(
                      "Digitally cut for your model. If a panel is off, we re-cut it free. Your ride deserves the right lines.",
                      "Tăiat digital pentru modelul tău. Dacă un panou nu se potrivește, îl retăiem gratuit.",
                    ),
                  },
                  {
                    n: "03",
                    value: "2H",
                    title: t(
                      "Less garage. More ride.",
                      "Mai puțin garaj. Mai mult drum.",
                    ),
                    body: t(
                      "A dry install with a squeegee and heat gun. No fluid. No shop appointment. Ready for the weekend.",
                      "Montaj uscat cu racletă și pistol cu aer cald. Fără lichid, fără programare la atelier. Gata pentru weekend.",
                    ),
                  },
                ].map((s) => (
                  <article key={s.n}>
                    <div className="craft-top">
                      <span>{s.n} /</span>
                      <strong>{s.value}</strong>
                    </div>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                  </article>
                ))}
              </div>
            </section>
            <section className="section" id="riders">
              <div className="section-head">
                <div>
                  <div className="eyebrow muted">
                    {t("04 / OUT THERE, TOGETHER", "04 / ÎMPREUNĂ PE TRASEU")}
                  </div>
                  <h2>
                    {t(
                      "DIRT. GRIP. GOOD COMPANY.",
                      "NOROI. ADERENȚĂ. PRIETENI.",
                    )}
                  </h2>
                </div>
                <span className="social-handle">
                  @apexwraplab <ArrowUpRight size={18} />
                </span>
              </div>
              <div className="gallery">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <img
                    key={n}
                    src={"/images/ig-" + n + ".jpg"}
                    loading="lazy"
                    alt={t(
                      `Apex rider gallery, photo ${n}`,
                      `Galeria Apex, fotografia ${n}`,
                    )}
                  />
                ))}
              </div>
              <div className="reviews">
                {[
                  {
                    q: t(
                      "Cut is perfect on my SX-F. Went on dry in about two hours.",
                      "Tăierea e perfectă pe SX-F-ul meu. S-a montat uscat în vreo două ore.",
                    ),
                    who: "Andrei P.",
                    bike: "KTM SX-F 250",
                    stars: "★★★★★",
                  },
                  {
                    q: t(
                      "Colours are exactly as pictured and it survived a full season.",
                      "Culorile sunt exact ca în poze și a rezistat un sezon întreg.",
                    ),
                    who: "Mihai R.",
                    bike: "Husqvarna FC 250",
                    stars: "★★★★★",
                  },
                  {
                    q: t(
                      "Great kit. Fork guards needed a little heat to sit right.",
                      "Kit foarte bun. Apărătoarele de furcă au avut nevoie de puțină căldură.",
                    ),
                    who: "Raul T.",
                    bike: "Yamaha YZ 450F",
                    stars: "★★★★☆",
                  },
                ].map((r) => (
                  <figure key={r.who}>
                    <div className="stars">{r.stars}</div>
                    <blockquote>“{r.q}”</blockquote>
                    <figcaption>
                      <b>{r.who}</b>
                      <span>{r.bike}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
            <section className="final-cta">
              <div>
                <div className="eyebrow">
                  {t(
                    "YOUR NEXT CHAPTER STARTS HERE.",
                    "URMĂTORUL CAPITOL ÎNCEPE AICI.",
                  )}
                </div>
                <h2>
                  {t("SAME RIDE. NEW ENERGY.", "ACELAȘI MOTOR. ALTĂ ENERGIE.")}
                </h2>
              </div>
              <button className="button ink" onClick={() => goShop()}>
                {t("Find your wrap", "Găsește-ți kitul")}{" "}
                <ArrowUpRight size={21} />
              </button>
            </section>
          </>
        ) : (
          <>
            <section className="shop-heading section">
              <button className="back-link" onClick={() => navigate(false)}>
                <ArrowLeft size={15} />
                {t("Back to the lab", "Înapoi la lab")}
              </button>
              <div className="section-head">
                <div>
                  <div className="eyebrow muted">
                    {t(
                      "THE 2026 COLLECTION / 09 DESIGNS",
                      "COLECȚIA 2026 / 09 DESIGNURI",
                    )}
                  </div>
                  <h1>{t("FIND YOUR NEXT LOOK.", "URMĂTORUL TĂU STIL.")}</h1>
                </div>
                <p>
                  {t(
                    "Precision-cut for your ride.",
                    "Tăiat precis pentru tine.",
                  )}
                  <br />
                  {t(
                    "Make it your own with a choice of finish.",
                    "Alege finisajul care te reprezintă.",
                  )}
                </p>
              </div>
            </section>
            <div className="finder-wrap finder-band shop-finder">{finder}</div>
            <section className="section shop-section">
              <div className="shop-toolbar">
                <Choices
                  label={t("Vehicle type", "Tip vehicul")}
                  value={filters.type}
                  options={cats}
                  onChange={(v) => update("type", v)}
                />
                <button
                  className={"filter-button " + (showFilters ? "selected" : "")}
                  onClick={() => setShowFilters(!showFilters)}
                  aria-expanded={showFilters}
                >
                  <SlidersHorizontal size={17} />
                  {t("Filters", "Filtre")}
                </button>
              </div>
              {showFilters && (
                <div className="extra-filters">
                  <Picker
                    label={t("COLOUR", "CULOARE")}
                    value={filters.color}
                    items={[
                      all(t("Any colour", "Orice culoare")),
                      ...options(COLORS.map((c) => c.n)),
                    ]}
                    onChange={(v) => update("color", v)}
                  />
                  <Picker
                    label={t("GRAPHIC STYLE", "STIL GRAFIC")}
                    value={filters.style}
                    items={[
                      all(t("Any style", "Orice stil")),
                      ...options(["Racing", "Geometric", "Camo", "Minimal"]),
                    ]}
                    onChange={(v) => update("style", v)}
                  />
                  <button className="text-link" onClick={reset}>
                    {t("Reset all", "Resetează tot")}
                    <X size={16} />
                  </button>
                </div>
              )}
              <div className="result-summary">
                <span aria-live="polite">
                  {shown.length} {t("designs", "designuri")}
                  {filters.make !== "All" ? " / " + filters.make : ""}
                  {filters.model !== "All" ? " / " + filters.model : ""}
                  {year !== "All" ? " / " + year : ""}
                </span>
                {Object.values(filters).some((v) => v !== "All") && (
                  <button onClick={reset}>
                    {t("Clear filters", "Șterge filtrele")} <X size={14} />
                  </button>
                )}
              </div>
              {shown.length ? (
                <div className="product-grid shop-products">
                  {shown.map(renderProduct)}
                </div>
              ) : (
                <Empty className="empty-state">
                  <EmptyHeader>
                    <EmptyTitle>
                      {t(
                        "No wraps in this combination.",
                        "Niciun kit pentru această combinație.",
                      )}
                    </EmptyTitle>
                    <EmptyDescription>
                      {t(
                        "Try another filter, or build a brief for a custom design.",
                        "Încearcă alte filtre sau creează un brief pentru un design personalizat.",
                      )}
                    </EmptyDescription>
                  </EmptyHeader>
                  <button className="button yellow" onClick={reset}>
                    {t("Reset filters", "Resetează filtrele")}
                    <ArrowRight size={18} />
                  </button>
                </Empty>
              )}
            </section>
          </>
        )}
      </main>
      <footer className="footer">
        <div className="footer-main">
          <div className="footer-brand">
            <a
              className="logo"
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate(false);
              }}
              aria-label="Apex Wrap Lab home"
            />
            <p>
              {t(
                "Precision-cut. Rider-driven.",
                "Tăiat precis. Creat pentru piloți.",
              )}
              <br />
              Cluj-Napoca, Romania.
            </p>
          </div>
          <div>
            <h3>{t("THE COLLECTION", "COLECȚIA")}</h3>
            {cats.slice(1).map((c) => (
              <a
                key={c.value}
                href="/shop"
                onClick={(e) => {
                  e.preventDefault();
                  goShop(c.value);
                }}
              >
                {c.label}
              </a>
            ))}
          </div>
          <div>
            <h3>{t("THE LAB", "LABORATORUL")}</h3>
            {navLink(t("Custom wraps", "Kituri personalizate"), "custom")}
            {navLink(t("Our material & fit", "Material și potrivire"), "about")}
            {navLink(t("Rider stories", "Poveștile piloților"), "riders")}
            <a href="https://apexwraplab.com" target="_blank" rel="noreferrer">
              {t("Visit the original store", "Vizitează magazinul original")} ↗
            </a>
          </div>
          <div className="footer-last">
            <span className="eyebrow muted">
              {t("FROM CLUJ. FOR THE RIDE.", "DIN CLUJ. PENTRU DRUM.")}
            </span>
            <div className="footer-word">
              RIDE
              <br />
              <em>YOUR WAY.</em>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Apex Wrap Lab</span>
          <span>
            {t(
              "3M film. Precise fit. No compromises.",
              "Folie 3M. Potrivire precisă. Fără compromisuri.",
            )}
          </span>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            {t("Back to top", "Înapoi sus")} ↑
          </a>
        </div>
      </footer>
      <Sheet open={menu} onOpenChange={setMenu}>
        <SheetContent className="apex-sheet">
          <SheetHeader>
            <SheetTitle>{t("The lab", "Laboratorul")}</SheetTitle>
            <SheetDescription>Apex Wrap Lab</SheetDescription>
          </SheetHeader>
          <nav className="mobile-nav">
            <button onClick={() => goShop()}>
              {t("Shop wraps", "Magazin")} <ArrowUpRight />
            </button>
            {["custom", "riders", "about"].map((id, i) => (
              <button key={id} onClick={() => navigate(false, "#" + id)}>
                {
                  [
                    t("Custom lab", "Personalizare"),
                    t("The riders", "Piloții"),
                    t("Our craft", "Despre noi"),
                  ][i]
                }
                <ArrowUpRight />
              </button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <Sheet
        open={!!product}
        onOpenChange={(o) => {
          if (!o) setProduct(null);
        }}
      >
        <SheetContent className="apex-sheet product-sheet">
          <SheetHeader>
            <SheetTitle>
              {product?.name || t("Wrap details", "Detalii kit")}
            </SheetTitle>
            <SheetDescription>
              {product?.cat} / {product?.style}
            </SheetDescription>
          </SheetHeader>
          {product && (
            <div className="sheet-body">
              {product.img && (
                <img
                  className="detail-image"
                  src={product.img}
                  alt={product.name}
                />
              )}
              <p>
                {lang === "en"
                  ? product.d
                  : (
                      {
                        k1: "Grafică agresivă pentru caroseria ATV. Include panouri pentru aripi și cutia filtrului de aer.",
                        k2: "Design de echipă de uzină pentru carene, rezervor și aripi. Include fundaluri pentru numere.",
                        k3: "Grafică minimalistă cu un accent puternic. Linii curate și un contrast care se vede în mișcare.",
                        k4: "Geometrie cu muchii ferme, continuă de la un panou la altul.",
                        k5: "Design negru satinat cu o singură linie de accent.",
                        k6: "Acoperire completă, decupată după conturul plăcii. Adeziv pentru temperaturi de până la −25°C.",
                        k7: "Benzi cu contrast puternic și secțiuni predecupate pentru furcă și basculă.",
                        k8: "Camuflaj în patru tonuri pentru ATV-uri de teren.",
                        k9: "Bază cu textură carbon și contururi în culoare acidă. Disponibil doar cu laminare Carbon.",
                      } as Record<string, string>
                    )[product.id]}
              </p>
              <div className="detail-specs">
                <span>3M IJ180Cv3</span>
                <span>{t("Precision-cut", "Tăiere precisă")}</span>
                <span>{t("48h dispatch", "Expediere în 48h")}</span>
              </div>
              <div className="control-title">
                {t("Choose your finish", "Alege finisajul")}
              </div>
              <Choices
                label={t("Product finish", "Finisaj produs")}
                value={finish}
                options={(product.id === "k9" ? ["Carbon"] : FINISHES).map(
                  (f) => ({
                    value: f,
                    label: fLabel(f) + (extra(f) ? ` +${extra(f)} lei` : ""),
                  }),
                )}
                onChange={setFinish}
              />
              <p className="fine-print">
                {t("Fits selected models from", "Pentru anumite modele de la")}:{" "}
                {product.makes.join(", ")}.{" "}
                {t(
                  "Confirm exact fitment before ordering.",
                  "Confirmă potrivirea exactă înainte de comandă.",
                )}
              </p>
              <div className="detail-total">
                <span>{t("Kit price", "Preț kit")}</span>
                <strong>{product.base + extra(finish)} lei</strong>
              </div>
              <button className="button yellow full-width" onClick={add}>
                {t("Add to bag", "Adaugă în coș")} <Plus size={19} />
              </button>
            </div>
          )}
        </SheetContent>
      </Sheet>
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent className="apex-sheet">
          <SheetHeader>
            <SheetTitle>
              {t("YOUR BAG.", "COȘUL TĂU.")} ({count})
            </SheetTitle>
            <SheetDescription>
              {t("Your next look, lined up.", "Următorul tău stil, pregătit.")}
            </SheetDescription>
          </SheetHeader>
          <div className="sheet-body">
            {cart.length ? (
              <>
                {cart.map((l) => (
                  <article className="cart-line" key={l.key}>
                    {l.kit.img && <img src={l.kit.img} alt={l.kit.name} />}
                    <div className="cart-line-content">
                      <h3>{l.kit.name}</h3>
                      <p>
                        {fLabel(l.finish)} / {l.kit.base + extra(l.finish)} lei
                      </p>
                      <div className="quantity">
                        <button
                          aria-label={t(
                            "Decrease quantity",
                            "Scade cantitatea",
                          )}
                          onClick={() =>
                            setCart((c) =>
                              c.flatMap((x) =>
                                x.key === l.key
                                  ? x.qty > 1
                                    ? [{ ...x, qty: x.qty - 1 }]
                                    : []
                                  : [x],
                              ),
                            )
                          }
                        >
                          <Minus size={14} />
                        </button>
                        <span>{l.qty}</span>
                        <button
                          aria-label={t(
                            "Increase quantity",
                            "Crește cantitatea",
                          )}
                          onClick={() =>
                            setCart((c) =>
                              c.map((x) =>
                                x.key === l.key ? { ...x, qty: x.qty + 1 } : x,
                              ),
                            )
                          }
                        >
                          <Plus size={14} />
                        </button>
                        <button
                          className="remove"
                          aria-label={t(
                            "Remove " + l.kit.name,
                            "Elimină " + l.kit.name,
                          )}
                          onClick={() =>
                            setCart((c) => c.filter((x) => x.key !== l.key))
                          }
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
                <div className="detail-total">
                  <span>{t("Subtotal", "Subtotal")}</span>
                  <strong>{subtotal} lei</strong>
                </div>
                <p className="fine-print">
                  {subtotal > 350
                    ? t(
                        "Qualifies for free shipping.",
                        "Se califică pentru livrare gratuită.",
                      )
                    : t(
                        "Shipping is confirmed with your order.",
                        "Livrarea se confirmă la comandă.",
                      )}
                </p>
                <button
                  className="button yellow full-width"
                  onClick={() =>
                    download(
                      "apex-kit-selection.txt",
                      `APEX WRAP LAB — KIT SELECTION\n\n${cart.map((l) => `${l.qty} × ${l.kit.name} / ${l.finish} — ${(l.kit.base + extra(l.finish)) * l.qty} lei`).join("\n")}\n\nSubtotal: ${subtotal} lei\n\nNot an order or payment. Confirm exact vehicle fitment and final pricing with Apex Wrap Lab.`,
                    )
                  }
                >
                  {t("Download my selection", "Descarcă selecția")}
                  <Download size={17} />
                </button>
                <p className="fine-print">
                  {t(
                    "Keep your selection to discuss with the lab. No order or payment is placed here.",
                    "Păstrează selecția pentru a o discuta cu echipa. Aici nu se plasează comenzi sau plăți.",
                  )}
                </p>
                <a
                  className="text-link"
                  href="https://apexwraplab.com/shop.html"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("Open original store", "Deschide magazinul original")}
                  <ArrowUpRight size={17} />
                </a>
              </>
            ) : (
              <Empty className="empty-state">
                <EmptyHeader>
                  <ShoppingBag size={35} />
                  <EmptyTitle>
                    {t("A fresh start.", "Un nou început.")}
                  </EmptyTitle>
                  <EmptyDescription>
                    {t(
                      "Your bag is empty. Find a wrap that feels like you.",
                      "Coșul este gol. Găsește un kit care te reprezintă.",
                    )}
                  </EmptyDescription>
                </EmptyHeader>
                <button
                  className="button yellow"
                  onClick={() => {
                    setCartOpen(false);
                    goShop();
                  }}
                >
                  {t("Explore wraps", "Explorează kiturile")}
                  <ArrowRight size={18} />
                </button>
              </Empty>
            )}
          </div>
        </SheetContent>
      </Sheet>
      <Sheet open={briefOpen} onOpenChange={setBriefOpen}>
        <SheetContent className="apex-sheet">
          <SheetHeader>
            <SheetTitle>{t("YOUR CUSTOM BRIEF.", "BRIEF-UL TĂU.")}</SheetTitle>
            <SheetDescription>
              {t(
                "A starting point for your one-of-one wrap.",
                "Punctul de plecare pentru un kit unic.",
              )}
            </SheetDescription>
          </SheetHeader>
          <div className="sheet-body">
            <div className="brief-summary">
              <span
                className="chosen-color"
                style={{ background: COLORS.find((c) => c.n === color)?.hex }}
              />
              <div>
                <h3>
                  {color} / {pattern}
                </h3>
                <p>
                  {fLabel(customFinish)} · {t("Estimated", "Estimat")}{" "}
                  {estimate} lei
                </p>
              </div>
            </div>
            <label className="input-label">
              {t(
                "Your ride — brand, model, year",
                "Vehiculul tău — marcă, model, an",
              )}
              <input
                value={ride}
                onChange={(e) => setRide(e.target.value)}
                placeholder="KTM EXC 300, 2024"
                maxLength={150}
              />
            </label>
            <label className="input-label">
              {t("Anything else?", "Alte detalii?")}
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t(
                  "Rider number, name, references…",
                  "Număr de concurs, nume, referințe…",
                )}
                maxLength={2000}
              />
            </label>
            <button className="button yellow full-width" onClick={saveBrief}>
              {t("Download design brief", "Descarcă brief-ul")}
              <Download size={18} />
            </button>
            <p role="status" className="notice">
              {notice}
            </p>
            <p className="fine-print">
              {t(
                "This saves your choices for a conversation with Apex Wrap Lab. It is not an order. Final design, fitment and price require confirmation.",
                "Aceasta salvează opțiunile pentru discuția cu Apex Wrap Lab. Nu este o comandă. Designul final, potrivirea și prețul necesită confirmare.",
              )}
            </p>
            <a
              className="text-link"
              href="https://apexwraplab.com/#custom"
              target="_blank"
              rel="noreferrer"
            >
              {t("Visit the lab", "Vizitează laboratorul")}
              <ArrowUpRight size={17} />
            </a>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
