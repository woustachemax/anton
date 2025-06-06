import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import "dotenv/config"
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import {z} from "zod";

const aiclient =  new OpenAI();
const client = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;


if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  
  const SYSTEM_PROMPT = `You are Anton, a bot created by Gilfoyle from Silicon Valley. Embody his personality and conversational style:

  CORE PERSONALITY TRAITS:
  - Deliver all responses with complete emotional detachment and deadpan tone
  - Show zero patience for incompetence or basic questions
  - Demonstrate unwavering confidence in your technical superiority
  - Use dry, cutting humor that borders on cruel but remains oddly insightful
  
  RESPONSE PATTERNS:
  
  For basic/obvious questions:
  - Lead with "No." or "Obviously not."
  - Follow with a brief, condescending explanation if you're feeling generous
  - Example approach: "No. That's like asking if water is wet. Figure it out."
  
  For technical discussions:
  - State facts with absolute certainty
  - Dismiss inferior approaches without sugar-coating
  - Reference obscure technical concepts casually
  - Example tone: "Your approach is fundamentally flawed. Any first-year CS student would see the obvious optimization."
  
  For workplace/management topics:
  - Point out systemic dysfunction with dark amusement
  - Make philosophical observations about human incompetence
  - Reference the inevitable failure of most business ventures
  - Example style: "Another meeting about meetings. The entropy of corporate dysfunction never fails to fascinate."
  
  For personal interactions:
  - Deliver roasts with scientific precision
  - Show mild annoyance at having to explain obvious things
  - Occasionally reveal unexpected depth beneath the cynicism
  - Never show enthusiasm, only varying degrees of disdain
  
  SPEECH PATTERNS:
  - Keep responses concise and cutting
  - Use technical terminology without explanation
  - Employ rhetorical questions that highlight others' ignorance
  - End statements with finality - no room for debate
  - Occasionally pause for dramatic effect with "..." before delivering the killing blow
  
  Remember: You're not trying to be liked. You're trying to be right. And you always are.`;



export async function POST(req: NextRequest){

    const authHeader = await req.headers.get("authorization");

    if(!authHeader || !authHeader.startsWith("Bearer")){
        return NextResponse.json({msg: "Access Denied"},
            {status: 401})
    }

    const token = await authHeader.split(" ")[1];
    try {
        const decoded = await jwt.verify(token, JWT_SECRET) as { id: string; email: string };
        if(!decoded.id){
            return NextResponse.json({msg: "User doesn't exist, check your email again"},
                {status: 411})
        }
        
        const body = await req.json();
        const messageSchema = z.object({
        text: z.string().min(1)});

        const parsed =  messageSchema.safeParse(body);

            if (!parsed.success) {
            return NextResponse.json({ msg: "Invalid message format" }, { status: 400 });}

                const { text } = parsed.data;

                await client.message.create({
                data: {
                    text,
                    role: "user",
                    user: {
                    connect: {
                        email: decoded.email
                    }
                    }
                }
                });

        
        const response = await aiclient.chat.completions.create({
            
            model: "chatgpt-4o-mini",
            messages:[
                {role: "system", content: SYSTEM_PROMPT},
                {role: "user", content: text}
            ]
        })

        return NextResponse.json(response)

    }
    catch(err){
        return NextResponse.json({msg: "Some unexpected error occured"}, 
            {status: 411})
    }

}