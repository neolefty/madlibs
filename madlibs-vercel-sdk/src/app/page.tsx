'use client'

import { useChat } from "ai/react"
import { AiDialogMessage } from "./aiDialogMessage"

export default function Home() {
    const { messages, input, handleInputChange, handleSubmit } = useChat({
        maxSteps: 5,
        initialMessages: [
            {
                id: "1",
                role: "user",
                content: "Let's write a Mad Lib! I'll give you a topic, and you make up a Mad Lib about it. "
                    + "Regular blanks should be enclosed in square brackets, and should be lower case, for example: "
                    + "[noun], [verb], or [neighborhood business]. Blanks that should repeat consistently across the story -- "
                    + "such as a main character or a setting that is mentioned multiple times -- should also be in square brackets, "
                    + "but capitalized, such as [Name of Person] or [City]."
            }
        ]
    })

    return (
        <div
            className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-4 sm:p-20">
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
                        onChange={handleInputChange}
                        placeholder="What is your story about?"
                        className="w-full p-4 text-lg border border-gray-300 rounded-lg min-w-[30rem]"
                    />
                </form>
            </main>
        </div>
    );
}

