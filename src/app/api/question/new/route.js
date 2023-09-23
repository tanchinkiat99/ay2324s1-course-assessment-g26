import { connectToDB } from "@utils/database";

export const POST = async (req) => {
    const { title, description, categories, complexity } = await req.body;

    try {
        await connectToDB();
    } catch (error) {
        
    }
}