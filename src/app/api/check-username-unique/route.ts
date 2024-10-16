import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UserNameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {

 //TODO use this in all other routes
    // if (request.method!= 'GET'){

    //     return Response.json(
    //         {
    //           success: false,
    //           message: "Only GET messages and resposes are allowed",
    //         },
    //         { status: 405 }
    //       )
    // }
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    //validate with zod here
    const result = UserNameQuerySchema.safeParse(queryParam);
    console.log(result); //TODO remove
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Username is availabe and you may proceed",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error checking username, error");
    return Response.json(
      {
        success: false,
        message: "Error Checking Username",
      },
      {
        status: 500,
      }
    );
  }
}
