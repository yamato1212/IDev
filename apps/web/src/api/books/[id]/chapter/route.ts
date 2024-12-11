import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { title, description, order } = await req.json();
    const chapter = await db.bookChapter.create({
      data: {
        title,
        description,
        order,
        slug: `${title.toLowerCase().replace(/\s+/g, "-")}`,
        bookId: params.id,
      },
    });
    return NextResponse.json({ chapter });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create chapter" }, { status: 500 });
  }
}