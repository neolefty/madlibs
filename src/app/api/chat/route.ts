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
                        weather: Math.round(Math.random() * (90 - 10) + 10),
                    }
                }
            }),
            clothing: tool({
                description: "Get clothing recommendations based on the weather",
                parameters: z.object({
                    weather: z.number().describe("The weather in fahrenheit"),
                }),
                execute: async ({ weather }) => {
                    if (weather < 20) return "Wear a heavy coat."
                    if (weather < 50) return "Wear a light coat."
                    return "Wear a t-shirt."
                }
            }),
        }
    })

    return result.toDataStreamResponse()
}