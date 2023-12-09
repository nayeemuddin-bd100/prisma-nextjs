import { connectToDb } from "@/utils";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async (
	req: Request,
	{ params }: { params: { id: string } }
) => {
	try {
		await connectToDb();
		const tweet = await prisma.tweets.findFirst({ where: { id: params.id } });
		return NextResponse.json({ tweet }, { status: 200 });
	} catch (error: any) {
		console.log(error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	} finally {
		prisma.$disconnect();
	}
};

export const PUT = async (
	req: Request,
	{ params }: { params: { id: string } }
) => {
	try {
		const { tweet } = await req.json();
		await connectToDb();
		const updateTweet = await prisma.tweets.update({
			data: { tweet },
			where: { id: params.id },
		});
		return NextResponse.json({ tweet: updateTweet }, { status: 200 });
	} catch (error: any) {
		console.log(error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	} finally {
		prisma.$disconnect();
	}
};

export const DELETE = async (
	req: Request,
	{ params }: { params: { id: string } }
) => {
	try {
		await connectToDb();
		const tweet = await prisma.tweets.delete({ where: { id: params.id } });

		return NextResponse.json(
			{ message: "Tweet deleted successfully" },
			{ status: 200 }
		);
	} catch (error: any) {
		console.log(error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	} finally {
		prisma.$disconnect();
	}
};
