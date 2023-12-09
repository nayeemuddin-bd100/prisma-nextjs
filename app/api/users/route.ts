import { connectToDb } from "@/utils"
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async (req:Request) => {
  try {
    await connectToDb()
    const users = await prisma.user.findMany({include: {tweets:true, _count:true}})
    return NextResponse.json({users}, {status: 200})
  } catch (error:any) {
    console.log(error)
    return NextResponse.json({ error:error.message }, { status: 500 });
  } finally {
    prisma.$disconnect()
  }
}