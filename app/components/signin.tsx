"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { signupSchema, loginSchema } from "@/lib/schema"
import axios from "axios"


type AuthType = "login" | "signup"
interface Inputs {
    email: string,
    password: string
}

interface Error{
    [key: string]: string
}

export default function Signin({type}:{type: AuthType}){
    const [inputs, setInputs] = useState<Inputs>({
        email: "",
        password: ""
    })

    const [errors, setErrors] = useState<Error>({});
    const router =  useRouter()

    const formHandler = (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setErrors({});

        const schema = type == "signup" ? signupSchema : loginSchema;
        const endpoint = type == "signup" ? "/api/v1/signup" : "/api/v1/login"

        const validate = schema.safeParse(inputs)

        if(!validate.success){
            const realError : Error = {};
            validate.error.errors.forEach((error)=>{
                const key = error.path[0] as string
                realError[key] = error.message
            })
            setErrors(realError)
            return;
        }
    }
}