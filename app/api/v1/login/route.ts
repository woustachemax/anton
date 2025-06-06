import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import "dotenv/config"
import {z} from 'zod'
import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from 'bcrypt';

const client = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})

export async function POST(req: NextRequest){
    const body = await req.json();
    const login = loginSchema.safeParse(body);
    const userExists = await client.user.findFirst({
        where:{
            email: body.email
        }
    })

    if(!userExists || !login.success){
        return NextResponse.json({msg: "User doesn't exist, check your email again"},
            {status: 411})
    }

     const revealedPassword = await bcrypt.compare(body.password, userExists.password)
    if(!revealedPassword){
        return NextResponse.json({msg: "Your password is incorrect"},
            {status: 411})

    }

    const token = jwt.sign({userId: userExists.id}, JWT_SECRET)

    return NextResponse.json({msg: "You are now logged in", token})
    
}