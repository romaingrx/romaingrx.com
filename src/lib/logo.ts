// The site mark: a 5x7 dot-matrix R. The last dot of the leg is the accent.
const ROWS = ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...@'];

type Cell = { col: number; row: number; accent: boolean };

export const CELLS: Cell[] = ROWS.flatMap((line, row) =>
  [...line].flatMap((c, col) => (c === '.' ? [] : [{ col, row, accent: c === '@' }])),
);

// Fixed colours for the raster and favicon versions, taken from the light theme.
const MARK_COLORS = { ink: '#372a15', paper: '#ece3d4', accent: '#d89f4b' };

type TileOptions = {
  /** Width and height of the output, in px. */
  size: number;
  /** Distance between two cells. */
  pitch: number;
  /** Diameter of a dot, or side of a square. */
  cell: number;
  /** Squares snap to the pixel grid, which keeps small favicons crisp. */
  shape: 'dot' | 'square';
  /** Corner radius of the background tile; 0 for a full-bleed square. */
  radius: number;
};

/** The mark on a filled tile, as a standalone SVG document. */
function tileSvg({ size, pitch, cell, shape, radius }: TileOptions): string {
  const { ink, paper, accent } = MARK_COLORS;
  const snap = (v: number) => (shape === 'square' ? Math.floor(v) : v);
  const x0 = snap((size - (4 * pitch + cell)) / 2);
  const y0 = snap((size - (6 * pitch + cell)) / 2);
  const cells = CELLS.map(({ col, row, accent: isAccent }) => {
    const x = x0 + col * pitch;
    const y = y0 + row * pitch;
    const fill = isAccent ? accent : paper;
    return shape === 'square'
      ? `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="${fill}"/>`
      : `<circle cx="${x + cell / 2}" cy="${y + cell / 2}" r="${cell / 2}" fill="${fill}"/>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="${ink}"/>${cells}</svg>`;
}

/** Hand-tuned tiles for each size the site serves. */
export const tiles = {
  // 16px: one solid pixel per cell, so the R is legible in a tab.
  icon16: tileSvg({ size: 16, pitch: 2, cell: 2, shape: 'square', radius: 3 }),
  // 32px and the SVG favicon: 3px squares with a 1px gap.
  icon32: tileSvg({ size: 32, pitch: 4, cell: 3, shape: 'square', radius: 6 }),
  // Large sizes have room for the round dots used in the header.
  large: tileSvg({ size: 36, pitch: 4, cell: 3.2, shape: 'dot', radius: 8 }),
  // iOS masks the corners itself and wants an opaque square.
  appleTouch: tileSvg({ size: 36, pitch: 4, cell: 3.2, shape: 'dot', radius: 0 }),
};
