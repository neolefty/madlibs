import { Fragment, useCallback, useEffect, useMemo, useState } from "react"

export const MadLibBlanks = ({blanks, setBlankValue}: UseBlanks) => {
    return (
        <div className="flex flex-wrap gap-2">
            {blanks.map((blank, i) => (
                <Fragment key={i}>
                    <input
                        type="text"
                        value={blank.value ?? ''}
                        onChange={e => setBlankValue(i, e.target.value)}
                        placeholder={blank.partOfSpeech}
                        className="p-2 text-lg border border-gray-300 rounded-lg"
                    />
                </Fragment>
            ))}
        </div>
    )
}

const blanksRegex = /\[(.*?)\]/g

// The LLM formats blanks inside square brackets, e.g. [noun] or [Cat's Name].
const getBlanks = (content: string): Blank[] => {
    const blanks: Blank[] = []
    const recurring = new Set()
    let match
    while ((match = blanksRegex.exec(content)) !== null) {
        // match[0] is the full match, e.g. [noun], and match[1] is the group inside the brackets, e.g. noun
        const partOfSpeech = match[1]
        const lc = partOfSpeech.toLowerCase()
        // The LLM tends to capitalize items that recur such as "Cat's Name" — detect these and show only one blank
        const isRecurring = lc !== match[1]
        if (!isRecurring || !recurring.has(lc)) {
            if (isRecurring) recurring.add(lc)
            blanks.push({
                partOfSpeech,
                isRecurring,
            })
        }
    }
    return blanks
}

export const fillInBlanks = (content: string, blanks: ReadonlyArray<Blank>) => {
    if (!blanks.length) return content
    const mutableBlanks = [...blanks]
    let result = ""
    let remaining = content
    let match
    while (remaining) {
        blanksRegex.lastIndex = 0
        match = blanksRegex.exec(remaining)
        if (!match) {
            // console.log({match, result, remaining})
            result += remaining
            remaining = ""
        } else {
            const [fullMatch, partOfSpeech] = match
            // find a matching blank — if it's not the first one, it must be a recurring one such as "Cat's Name"
            let blank = mutableBlanks[0]
            if (blank?.partOfSpeech === partOfSpeech)  // if it is the first one, remove it from the list
                mutableBlanks.shift()
            if (!blank || blank.partOfSpeech !== partOfSpeech)
                blank = blanks.find(b => b.partOfSpeech === partOfSpeech) ?? unknownBlank

            result += remaining.slice(0, match.index)
            result += blank?.value ? `**${blank.value}**` : fullMatch  // bold if value; preserve brackets if no value
            remaining = remaining.slice(match.index + fullMatch.length)
            // console.log({fullMatch, partOfSpeech, blank, result, remaining, mutableBlanks})
        }
    }
    return result
}

interface Blank {
    // verb, noun, person's name, location, etc.
    partOfSpeech: string
    // Whether the blank is recurring in the story
    isRecurring: boolean
    // The value filled in by the user
    value?: string
}

const unknownBlank: Blank = {
    partOfSpeech: "unknown",
    isRecurring: false,
    value: "*unknown*",
}

interface UseBlanks {
    blanks: Blank[]
    setBlankValue: (index: number, value: string) => void
}

export const useBlanks = (content: string): UseBlanks => {
    // new blanks will stream in as LLM generates content
    const rawBlanks = useMemo(() => getBlanks(content), [content])
    const [blanks, setBlanks] = useState<Blank[]>(rawBlanks)
    useEffect(() => {
        // preserve user input while new blanks stream in
        const mergedBlanks = rawBlanks.map((blank, i) =>
            blanks[i] ?? blank)
        setBlanks(mergedBlanks)
    }, [rawBlanks])
    const setBlankValue = useCallback((index: number, value: string) => {
        setBlanks(blanks.map((b, i) => i === index ? {...b, value} : b))
    }, [blanks])
    return {blanks, setBlankValue}
}