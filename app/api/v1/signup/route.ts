import {z} from "zod" 
import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import 'dotenv/config'


const client = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  


const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})


export async function POST(req: NextRequest){
    const user = await req.json()
    const verify = await signupSchema.safeParse(user);
    if(!user || !verify.success){
        return NextResponse.json({msg: "The email or password is incorrect"},
             {status: 411})
    }
    const hashedPassword = await bcrypt.hash(user.password, 10)
    try{
        const newUser = await client.user.create({
            data:{
                email: user.email,
                password: hashedPassword
            }
        })
    
        const token = jwt.sign({userId: newUser.id}, JWT_SECRET)
    
    
        return NextResponse.json({msg: "User Created Successfully", token})
    }
    catch(err){
        return NextResponse.json({msg: "There was an error creating your user, try again later"}, {status: 411})
    }


}

