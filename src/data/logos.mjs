/**
 * Client logos, normalised to a single monochrome set for the dark canvas.
 * Sources in public/client-logos/ are 500x500 tiles with solid backgrounds;
 * these are keyed, trimmed, density-matched and re-encoded.
 * Regenerate with scripts/build-logos.py after adding new artwork.
 *
 * Intrinsic dimensions are recorded so each <img> can reserve its box and the
 * marquee never shifts as images decode.
 */
export const LOGOS = [
  { src: '/logos/1.webp', w: 258, h: 92, name: 'SPIL' },
  { src: '/logos/3.webp', w: 300, h: 87, name: 'Wild Bloom' },
  { src: '/logos/4.webp', w: 129, h: 92, name: 'Momentum Fitness' },
  { src: '/logos/5.webp', w: 221, h: 92, name: 'Electrical and Plumbing Services' },
  { src: '/logos/6.webp', w: 300, h: 69, name: 'OEC Oceanic Engineering Consultants' },
  { src: '/logos/7.webp', w: 78, h: 92, name: 'A Innovation' },
  { src: '/logos/8.webp', w: 204, h: 92, name: 'Blossom & Dew' },
  { src: '/logos/9.webp', w: 300, h: 82, name: 'Edibear' },
  { src: '/logos/10.webp', w: 111, h: 92, name: 'Walkers Yachts' },
  { src: '/logos/11.webp', w: 222, h: 92, name: 'Novatec Glass' },
  { src: '/logos/12.webp', w: 145, h: 92, name: 'World in Seconds' },
  { src: '/logos/13.webp', w: 257, h: 92, name: 'MyITCerts' },
  { src: '/logos/14.webp', w: 275, h: 92, name: 'Medico' },
  { src: '/logos/15.webp', w: 300, h: 73, name: 'Events Exhibition Management' },
  { src: '/logos/16.webp', w: 181, h: 92, name: 'Ultimate MRCEM SBA' },
  { src: '/logos/17.webp', w: 267, h: 92, name: 'OAP Exam Support' },
  { src: '/logos/18.webp', w: 205, h: 92, name: 'Naturelac Paints' },
  { src: '/logos/19.webp', w: 268, h: 92, name: 'Argus Systems' },
  { src: '/logos/20.webp', w: 300, h: 89, name: 'AI Exam Support' },
];
