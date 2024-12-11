import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id :string, chapterId: string, sectionId: string } }
) {
  try {
    const { title, description, order } = await req.json();
    const section = await db.bookSubSection.create({
      data: {
        title,
        description,
        order,
        slug: `${title.toLowerCase().replace(/\s+/g, "-")}`,
        bookSectionId: params.sectionId
      },
    });
    return NextResponse.json({ section });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create chapter" }, { status: 500 });
  }
}