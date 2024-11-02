import { streamText, tool } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

// Allow streaming up to 30 seconds
export const maxDuration = 30

export async function  POST(req: Request) {
    const { messages } = await req.json();

    const result = await streamText({
        model: openai('gpt-4-turbo'),
        messages,
        tools: {
            weather: tool({
                description: "Get the weather in a location (fahrenheit)",
                parameters: z.object({
                    location: z.string().describe("The location to get the weather for"),
                }),
                execute: async ({ location }) => {
                    return {
                        location,
                        weather: Math.round(Math.random() * (80 - 20) + 20),
                    }
                }
            }),
            clothing: tool({
                description: "Get clothing recommendations based on the weather",
                parameters: z.object({
                    weather: z.number().describe("The weather in fahrenheit"),
                }),
                execute: async ({ weather }) => {
                    if (weather < 40) {
                        return "You should wear a coat"
                    } else if (weather < 60) {
                        return "You should wear a jacket"
                    } else {
                        return "You should wear a t-shirt"
                    }
                }
            }),
        }
    })

    return result.toDataStreamResponse()
}