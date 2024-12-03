import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	// User テーブルにユーザーを作成する
	const user1 = await prisma.user.create({
		data: {
			name: "John Doe",
			username: "johndoe",
			email: "john@example.com",
			role: "USER", // ユーザーのロールを指定する
		},
	});

	// Book テーブルに本を作成する
	const book1 = await prisma.book.create({
		data: {
			title: "Nextjs",
			slug: "nextjs",
			description: "This is a sample book.",
			icon: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/nextjs-icon.png",
			category: "programming",
			color: "98DFFE",
			userId: user1.id,
		},
	});

	console.log("Seed data created successfully");
}

main()
	.catch((error) => {
		console.error(error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
