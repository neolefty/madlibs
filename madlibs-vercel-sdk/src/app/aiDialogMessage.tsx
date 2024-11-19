"use client"

import { Message } from "ai"
import Markdown from "react-markdown"
import { Fragment } from "react"
import { fillInBlanks, MadLibBlanks, useBlanks } from "./madLibBlanks"

export const AiDialogMessage = ({message, isPrompt}: { message: Message, isPrompt?: boolean }) => {
    const {blanks, setBlankValue} = useBlanks(message.content)
    const isLlmResponse = message.role === 'assistant'
    const isMadLib = isLlmResponse && blanks.length > 0  // messageLc?.includes('mad lib') || messageLc?.includes('madlib')
    return (
        <>
            <strong>{isPrompt ? 'System' : message.role === 'user' ? 'You' : 'AI'}: </strong>
            <div className="flex gap-8">
                {message.content && (
                    <div className="flex flex-col gap-2 madlib min-w-[35vw]">
                        <Markdown>{fillInBlanks(message.content, blanks)}</Markdown>
                    </div>
                )}
                {isMadLib && (
                    <MadLibBlanks blanks={blanks} setBlankValue={setBlankValue}/>
                )}
                {message.toolInvocations && (
                    <pre>{JSON.stringify(message.toolInvocations, null, 2)}</pre>
                )}
            </div>
        </>
    )
}
