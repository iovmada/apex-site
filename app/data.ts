export const KITS = [
  {
    id: 'k1',
    name: 'Apex Predator',
    cat: 'ATV Wraps',
    type: 'ATV',
    style: 'Racing',
    color: 'Volt',
    base: 269,
    hot: true,
    img: '/images/kit-apex-predator.jpg',
    makes: ['Can-Am', 'Yamaha'],
    a: 'linear-gradient(115deg,rgba(200,255,0,.85) 0%,rgba(200,255,0,0) 52%,rgba(255,59,20,.75) 100%)',
    b: '#C8FF00',
    d: 'Aggressive forward-sweep livery built for quad bodywork. Deep-relief panels included for fenders and airbox.',
  },
  {
    id: 'k2',
    name: 'Factory Replica',
    cat: 'Enduro & MX',
    type: 'MX',
    style: 'Racing',
    color: 'Podium Yellow',
    base: 259,
    hot: true,
    img: '/images/kit-factory-replica.jpg',
    makes: ['KTM', 'Husqvarna', 'Honda'],
    a: 'linear-gradient(115deg,rgba(255,212,0,.8) 0%,rgba(255,212,0,0) 48%,rgba(47,199,255,.6) 100%)',
    b: '#FFD400',
    d: 'Works-team layout with shroud, tank and fender coverage. Number-plate backgrounds included.',
  },
  {
    id: 'k3',
    name: 'Crimson Stealth',
    cat: 'Street Bikes',
    type: 'Street',
    style: 'Minimal',
    color: 'Crimson',
    base: 289,
    hot: true,
    img: '/images/kit-crimson-stealth.jpg',
    makes: ['Yamaha', 'Honda', 'KTM'],
    a: 'linear-gradient(115deg,rgba(224,27,46,.9) 0%,rgba(224,27,46,0) 55%,rgba(58,63,68,.8) 100%)',
    b: '#E01B2E',
    d: 'Single-sweep split with a matte body and gloss accent. Reads clean at a standstill, vicious at speed.',
  },
  {
    id: 'k4',
    name: 'Volt Surge',
    cat: 'ATV Wraps',
    type: 'ATV',
    style: 'Geometric',
    color: 'Ice Blue',
    base: 279,
    hot: false,
    img: '/images/kit-volt-surge.jpg',
    makes: ['Can-Am', 'Yamaha'],
    a: 'linear-gradient(115deg,rgba(47,199,255,.75) 0%,rgba(47,199,255,0) 50%,rgba(200,255,0,.8) 100%)',
    b: '#2FC7FF',
    d: 'Hard-edged shard geometry that wraps continuously across every panel seam.',
  },
  {
    id: 'k5',
    name: 'Night Shift',
    cat: 'Street Bikes',
    type: 'Street',
    style: 'Minimal',
    color: 'Stealth',
    base: 299,
    hot: false,
    img: '',
    makes: ['Yamaha', 'Honda'],
    a: 'linear-gradient(115deg,rgba(58,63,68,.9) 0%,rgba(58,63,68,0) 60%,rgba(20,24,28,.8) 100%)',
    b: '#3A3F44',
    d: 'Murdered-out satin body with a single raised waistline. Our most requested street finish.',
  },
  {
    id: 'k6',
    name: 'Glacier Geo',
    cat: 'Snowboard',
    type: 'Board',
    style: 'Geometric',
    color: 'Ice Blue',
    base: 189,
    hot: false,
    img: '',
    makes: ['Any brand'],
    a: 'linear-gradient(115deg,rgba(47,199,255,.85) 0%,rgba(47,199,255,0) 55%,rgba(244,246,242,.6) 100%)',
    b: '#2FC7FF',
    d: 'Full topsheet coverage cut to board outline. Cold-rated adhesive down to -25°C.',
  },
  {
    id: 'k7',
    name: 'Podium Strike',
    cat: 'Enduro & MX',
    type: 'MX',
    style: 'Racing',
    color: 'Podium Yellow',
    base: 259,
    hot: false,
    img: '',
    makes: ['KTM', 'Husqvarna'],
    a: 'linear-gradient(115deg,rgba(255,212,0,.85) 0%,rgba(255,212,0,0) 52%,rgba(15,18,21,.8) 100%)',
    b: '#FFD400',
    d: 'High-contrast strike bands with pre-cut fork-guard and swingarm sections.',
  },
  {
    id: 'k8',
    name: 'Forest Camo',
    cat: 'ATV Wraps',
    type: 'ATV',
    style: 'Camo',
    color: 'Field Green',
    base: 249,
    hot: false,
    img: '',
    makes: ['Can-Am', 'Honda', 'Yamaha'],
    a: 'linear-gradient(115deg,rgba(111,138,74,.85) 0%,rgba(111,138,74,0) 55%,rgba(30,38,26,.8) 100%)',
    b: '#6F8A4A',
    d: 'Four-tone woodland pattern with no repeating tile across the kit. Built for hunting rigs.',
  },
  {
    id: 'k9',
    name: 'Carbon Edge',
    cat: 'Street Bikes',
    type: 'Street',
    style: 'Geometric',
    color: 'Stealth',
    base: 319,
    hot: false,
    img: '',
    makes: ['Yamaha', 'Honda', 'KTM'],
    a: 'linear-gradient(115deg,rgba(32,38,43,.9) 0%,rgba(32,38,43,0) 52%,rgba(200,255,0,.7) 100%)',
    b: '#20262B',
    d: 'Textured carbon base with acid edge-lining. Ships only in the carbon finish laminate.',
  },
];
export type Kit = (typeof KITS)[number];
export const MODELS: Record<string, string[]> = {
  'Can-Am': ['Outlander 650', 'Renegade 1000'],
  Honda: ['CRF 250R', 'CBR 650R', 'TRX 450R'],
  Husqvarna: ['FC 250', 'TE 300'],
  KTM: ['SX-F 250', 'EXC 300', 'Duke 890'],
  Yamaha: ['YZ 450F', 'MT-07', 'Raptor 700'],
};
export const MODEL_TYPES: Record<string, string> = {
  'Outlander 650': 'ATV',
  'Renegade 1000': 'ATV',
  'CRF 250R': 'MX',
  'CBR 650R': 'Street',
  'TRX 450R': 'ATV',
  'FC 250': 'MX',
  'TE 300': 'MX',
  'SX-F 250': 'MX',
  'EXC 300': 'MX',
  'Duke 890': 'Street',
  'YZ 450F': 'MX',
  'MT-07': 'Street',
  'Raptor 700': 'ATV',
};
export const COLORS = [
  { n: 'Volt', hex: '#dcfa32' },
  { n: 'Podium Yellow', hex: '#ffd400' },
  { n: 'Crimson', hex: '#e01b2e' },
  { n: 'Ice Blue', hex: '#2fc7ff' },
  { n: 'Stealth', hex: '#70766c' },
  { n: 'Field Green', hex: '#6f8a4a' },
];
export const FINISHES = ['Gloss', 'Matte', 'Carbon'];
export const extra = (finish: string) =>
  finish === 'Carbon' ? 60 : finish === 'Matte' ? 30 : 0;
export type Filters = {
  type: string;
  make: string;
  model: string;
  color: string;
  style: string;
};
export const defaultFilters: Filters = {
  type: 'All',
  make: 'All',
  model: 'All',
  color: 'All',
  style: 'All',
};
export function filterKits(f: Filters) {
  return KITS.filter(
    (k) =>
      (f.type === 'All' || k.type === f.type) &&
      (f.make === 'All' || k.makes.includes(f.make)) &&
      (f.model === 'All' || k.type === MODEL_TYPES[f.model]) &&
      (f.color === 'All' || k.color === f.color) &&
      (f.style === 'All' || k.style === f.style),
  );
}
