import Marquee from "@/components/ui/marquee";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { db } from "@repo/database";
const ReviewCard = ({
  id,
  title,
  slug,
  icon,
}: {
  id: string;
  title: string;
  slug: string;
  icon: string;
}) => {
  return (
    <div className="z-1 mb-2 flex relative bg-white">
      <div className={cn("w-2 rounded-md border shadow-md ")} />
      <div
        className={cn(
          "flex  flex-col border py-8 text-center max-w-40  w-[100px] shadow-md"
        )}
      >
        <div className="flex-1">
          <h3 className="md:text-md text-sm font-semibold">{title}</h3>
        </div>
        <div className="flex justify-center p-4 ">
          <Image src={icon} alt={title} width={30} height={30} />
        </div>
      </div>
    </div>
  );
};

export async function MarqueeDemo() {
  const books = await db.book.findMany();

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-lg  bg-background ">
      <Marquee pauseOnHover className="[--duration:40s]">
        {books.map((book) => (
          <ReviewCard key={book.id} {...book} />
        ))}
      </Marquee>
    </div>
  );
}
