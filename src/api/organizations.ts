import { fetchOrganizations } from "@/lib/db";
import { Request, Response, Router } from "express";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const createdAt = (req.query["created-at"] as string) ?? "";
  const keyword = (req.query["q"] as string) ?? "";
  const limit = 10;

  try {
    const organizations = await fetchOrganizations({
      limit: limit + 1, // 多拿一筆檢查是否需要回傳 cursor
      cursor: createdAt ? new Date(createdAt) : undefined,
      keyword,
    });

    let nextCursor: string | null = null;

    if (organizations.length > limit) {
      nextCursor = organizations[limit - 1].createdAt.toISOString();
      organizations.length = limit;
    }

    res.json({
      data: organizations,
      nextCursor,
    });
  } catch (error) {
    console.error("Error fetching organizations:", error);

    res.json({ data: [], nextCursor: null });
  }
});

export default router;
