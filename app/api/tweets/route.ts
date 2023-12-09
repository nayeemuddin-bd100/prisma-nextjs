import { connectToDb } from "@/utils";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async () => {
	try {
		await connectToDb();

		const tweets = await prisma.tweets.findMany();

		return NextResponse.json({ tweets }, { status: 200 });
	} catch (error: any) {
		console.log(error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	} finally {
		prisma.$disconnect();
	}
};

export const POST = async (req: Request) => {
	try {
		const { tweet, userId } = await req.json();

		if (!userId && !tweet) {
			return NextResponse.json({ error: "Invalid data" }, { status: 422 });
		}
		await connectToDb();

    const user = await prisma.user.findFirst({ where: { id: userId } });
    
		if (!user) {
			return NextResponse.json({ message: "User Not Found" });
		}

		const newTweet = await prisma.tweets.create({ data: { tweet, userId } });

		return NextResponse.json({ newTweet }, { status: 200 });
	} catch (error: any) {
		console.log(error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	} finally {
		prisma.$disconnect();
	}
};
