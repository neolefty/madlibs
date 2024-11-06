'use client'

import { useChat } from "ai/react"
import { AiDialogMessage } from "./aiDialogMessage"

export default function Home() {
    const { messages, input, handleInputChange, handleSubmit } = useChat({
        maxSteps: 5,
        initialInput: "Write a Mad Lib about ___. Enclose the blanks in square brackets, like [noun] or [Name of Person].",
    })

    return (
        <div
            className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <h1 className="text-4xl font-bold text-center sm:text-left">
                    Tell your story
                </h1>
                <div style={{
                    display: "grid",
                    gridGap: "1rem",
                    gridTemplateColumns: "min-content 1fr",
                }}>
                    {messages.map(m => (
                        <AiDialogMessage message={m} key={m.id} />
                    ))}
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-lg">
                    <input
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="What would you like your Mad Lib to be about?"
                        className="w-full p-4 text-lg border border-gray-300 rounded-lg min-w-[30rem]"
                    />
                </form>
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
            </footer>
        </div>
    );
}

