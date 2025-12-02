import express, { Request, Response } from "express";
import path from "path";
import { promises as fs } from "fs";
import { VISION_BOARD_ITEMS as visionBoardItems } from "./constants/visionBoards";
import { PLACES_DATA } from "./constants/placesData";

const app = express();
const PORT = process.env.PORT || 3000;
const assetsDir = path.join(__dirname, "..", "assets");

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello TypeScript + Express + pnpm!");
});

app.get("/vision", (req: Request, res: Response) => {
  // const boardId = req.query.boardId as string | undefined;

  // const board = visionBoards;

  // if (boardId) {
  //   const board = visionBoards.find((visionBoard) => {
  //     return visionBoard.id === boardId;
  //   });

    // if (!board) {
    //   return res.status(404).json({
    //     data: null,
    //     meta: {
    //       code: "VISION_NOT_FOUND",
    //       displayMessage: "We couldn't find that vision board.",
    //       message: "Vision board not found",
    //       status: 404,
    //     },
    //   });
    // }

  //   return res.json({
  //     data: { item: board },
  //     meta: {
  //       code: "VISION_FETCH_SUCCESS",
  //       displayMessage: "Vision board fetched successfully.",
  //       message: "Vision board retrieved successfully.",
  //       status: 200,
  //     },
  //   });
  // }

  const page = Number.parseInt(req.query.page as string, 10) || 1;
  const limit = Number.parseInt(req.query.limit as string, 10) || 10;

  const safePage = page < 1 ? 1 : page;
  const safeLimit = limit < 1 ? 10 : limit;
  const startIndex = (safePage - 1) * safeLimit;
  const endIndex = startIndex + safeLimit;

  const paginatedBoards = visionBoardItems.slice(startIndex, endIndex);
  const total = visionBoardItems.length;
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));

  return res.json({
    // data: {
    //   items: paginatedBoards,
    //   pagination: {
    //     page: safePage,
    //     limit: safeLimit,
    //     total,
    //     totalPages,
    //     hasNext: safePage < totalPages,
    //     hasPrevious: safePage > 1,
    //   },
    // },
    data: {items: paginatedBoards},
    meta: {
      code: "VISION_PAGINATION_SUCCESS",
      displayMessage: "Vision boards fetched successfully.",
      message: "Vision boards retrieved successfully.",
      status: 200,
    },
  });
});

app.get("/vision/image/:fileName", async (req: Request, res: Response) => {
  const { fileName } = req.params;

  if (!fileName) {
    return res.status(400).json({ message: "Image file name is required." });
  }

  const safePath = path.join(assetsDir, fileName);

  if (!safePath.startsWith(assetsDir)) {
    return res.status(400).json({ message: "Invalid image path." });
  }

  try {
    await fs.access(safePath);
  } catch {
    return res.status(404).json({ message: "Image not found." });
  }

  res.sendFile(safePath, (error) => {
    if (error) {
      res.status(500).json({ message: "Failed to stream image." });
    }
  });
});


app.get("/onboarding", async (req: Request, res: Response) => {
  const search = (req.query.search as string | undefined)?.trim().toLowerCase();

  console.log(`[seach] ${req.query.search}`)

  // If no search term provided, return all places
  let results = PLACES_DATA;

  if (search && search.length > 0) {
    results = PLACES_DATA.filter((place) => {
      return (
        place.name.toLowerCase().includes(search) ||
        place.address.toLowerCase().includes(search) ||
        place.country.toLowerCase().includes(search)
      );
    });
  }

  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(undefined);
    }, 2 * 1000);
  })

  return res.json({
    data: { items: results },
    meta: {
      code: "ONBOARDING_FETCH_SUCCESS",
      displayMessage: "Places fetched successfully.",
      message: "Onboarding places retrieved successfully.",
      status: 200,
    },
  });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
