'use client'

import { useChat } from "ai/react"
import { Fragment } from "react"
import Markdown from "react-markdown"

export default function Home() {
    const { messages, input, handleInputChange, handleSubmit } = useChat({
        maxSteps: 5,
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
                        <Fragment key={m.id}>
                            <strong>{m.role === 'user' ? 'You: ' : 'AI: '}</strong>
                            <div className="flex">
                                {m.content && (
                                    <div className="flex flex-col gap-2">
                                        <Markdown>{m.content}</Markdown>
                                    </div>
                                )}
                                {m.toolInvocations && (
                                    <pre>{JSON.stringify(m.toolInvocations, null, 2)}</pre>
                                )}
                            </div>
                        </Fragment>
                    ))}
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-lg">
                    <input
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Say something..."
                        className="w-full p-4 text-lg border border-gray-300 rounded-lg"
                    />
                </form>
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
            </footer>
        </div>
    );
}
