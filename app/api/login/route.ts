import { connectToDb } from "@/utils";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const POST = async (req: Request) => {
	try {
		const { email, password } = await req.json();

		if (!email && !password) {
			return NextResponse.json({ error: "Invalid data" }, { status: 422 });
		}
		await connectToDb();

		const existingUser = await prisma.user.findFirst({ where: { email } });
		if (!existingUser) {
			return NextResponse.json({ message: "User Not Found" }, { status: 401 });
		}

		const isPasswordValid = await bcrypt.compare(
			password.toString(),
			existingUser.password
		);

		if (!isPasswordValid) {
			return NextResponse.json(
				{ message: "Password is not matched" },
				{ status: 403 }
			);
		}
		return NextResponse.json(
			{ message: "Login successfully" },
			{ status: 200 }
		);
	} catch (error: any) {
		console.log(error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	} finally {
		prisma.$disconnect();
	}
};
