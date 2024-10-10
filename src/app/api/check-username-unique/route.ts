import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UserNameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    await dbConnect()

    try{
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }

        //validate with zod here

    }
    catch(error){
        console.error("Error checking username, error")
        return Response.json(
            {
                success: false,
                message: "Error Checking Username",
            },
            {
                status : 500
            }
        )
    }
}