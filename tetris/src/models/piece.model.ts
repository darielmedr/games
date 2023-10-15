import { Coord } from "./coord.model";

export interface Piece {
  position: Coord;
  shape: Shape;
  width: number;
  height: number;
}

export type Shape = number[][];

export const PieceName = [
  "smashboy",
  "teewee",
  "hero",
  "blueRicky",
  "orangeRicky",
  "clevelandZ",
  "rhodeIslandZ",
] as const;
export type PieceType = (typeof PieceName)[number];

export const PieceShape: Record<PieceType, Omit<Piece, "position">> = {
  smashboy: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    width: 2,
    height: 2,
  },
  teewee: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    width: 3,
    height: 2,
  },
  hero: {
    shape: [[1, 1, 1, 1]],
    width: 4,
    height: 1,
  },
  blueRicky: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    width: 3,
    height: 2,
  },
  orangeRicky: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    width: 3,
    height: 2,
  },
  clevelandZ: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    width: 3,
    height: 2,
  },
  rhodeIslandZ: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    width: 3,
    height: 2,
  },
};
