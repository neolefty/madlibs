"use client"

import { UIMessage } from "ai"
import Markdown from "react-markdown"
import { fillInBlanks, MadLibBlanks, useBlanks } from "./madLibBlanks"

// Extract text content from UIMessage parts
const getTextContent = (message: UIMessage): string => {
    return message.parts
        ?.filter((part): part is { type: 'text'; text: string } => part.type === 'text')
        .map(part => part.text)
        .join('') ?? ''
}

// Extract tool invocations from UIMessage parts
const getToolInvocations = (message: UIMessage) => {
    return message.parts?.filter(part => part.type === 'tool-invocation') ?? []
}

export const AiDialogMessage = ({message, isPrompt}: { message: UIMessage, isPrompt?: boolean }) => {
    const content = getTextContent(message)
    const {blanks, setBlankValue} = useBlanks(content)
    const isLlmResponse = message.role === 'assistant'
    const isMadLib = isLlmResponse && blanks.length > 0
    const toolInvocations = getToolInvocations(message)
    return (
        <>
            <strong>{isPrompt ? 'System' : message.role === 'user' ? 'You' : 'AI'}: </strong>
            <div className="flex gap-8">
                {content && (
                    <div className="flex flex-col gap-2 madlib min-w-[35vw]">
                        <Markdown>{fillInBlanks(content, blanks)}</Markdown>
                    </div>
                )}
                {isMadLib && (
                    <MadLibBlanks blanks={blanks} setBlankValue={setBlankValue}/>
                )}
                {toolInvocations.length > 0 && (
                    <pre>{JSON.stringify(toolInvocations, null, 2)}</pre>
                )}
            </div>
        </>
    )
}
