'use client'

import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { AiDialogMessage } from "./aiDialogMessage"

export default function Home() {
    const [input, setInput] = useState("")
    const { messages, sendMessage, status } = useChat({
        messages: [
            {
                id: "1",
                role: "user",
                parts: [
                    {
                        type: "text",
                        text: "Let's write a Mad Lib! I'll give you a topic, and you make up a Mad Lib about it. "
                            + "Regular blanks should be enclosed in square brackets, and should be lower case, for example: "
                            + "[noun], [verb], or [neighborhood business]. Blanks that should repeat consistently across the story -- "
                            + "such as a main character or a setting that is mentioned multiple times -- should also be in square brackets, "
                            + "but capitalized, such as [Name of Person] or [City]."
                    }
                ]
            }
        ]
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || status === 'streaming') return
        const text = input
        setInput("")
        await sendMessage({ text })
    }

    return (
        <div
            className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-4 md:p-20">
            <main className="flex flex-col gap-8 row-start-2 items-center md:items-start">
                <h1 className="text-4xl font-bold text-center md:text-left md:ml-20">
                    Tell your story
                </h1>
                <div style={{
                    display: "grid",
                    gridGap: "1rem",
                    gridTemplateColumns: "min-content 1fr",
                }}>
                    {messages.map((m, i) => (
                        <AiDialogMessage message={m} isPrompt={i === 0}  key={m.id} />
                    ))}
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-lg md:self-left md:ml-20">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="What is your story about?"
                        className="w-full p-4 text-lg border border-gray-300 rounded-lg min-w-[30rem]"
                        disabled={status === 'streaming'}
                    />
                </form>
                <div className="text-md text-gray-500 text-center md:ml-20 md:text-left hover:underline">
                    <a href="https://github.com/neolefty/madlibs">Code</a>
                </div>
            </main>
        </div>
    );
}
