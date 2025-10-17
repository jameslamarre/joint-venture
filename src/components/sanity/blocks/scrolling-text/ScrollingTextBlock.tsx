import { type FC } from 'react'
import classNames from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import type {
  RichText as RichTextType,
  ScrollingTextBlock as ScrollingTextBlockType,
} from '@gen/sanity-schema'
import type { SanityBlockElement } from '@components/sanity'
import { Block, RichText } from '@components/sanity'
import { RoughNotation } from 'react-rough-notation'

// Typewriter animation component
const TypewriterText = ({
  richTextBlocks,
}: {
  richTextBlocks: RichTextType
}) => {
  // Extract text with mark information from Sanity block structure
  const extractWordsWithMarks = (
    blocks: any[]
  ): Array<{
    text: string
    isHighlight: boolean
    isUnderline: boolean
    isCircle: boolean
  }> => {
    if (!blocks || !Array.isArray(blocks)) return []

    const words: Array<{
      text: string
      isHighlight: boolean
      isUnderline: boolean
      isCircle: boolean
    }> = []

    blocks.forEach(block => {
      if (
        block._type === 'block' &&
        block.children &&
        Array.isArray(block.children)
      ) {
        block.children.forEach((child: any) => {
          if (child._type === 'span' && typeof child.text === 'string') {
            const isHighlight = child.marks && child.marks.includes('highlight')
            const isUnderline =
              child.marks && child.marks.includes('redUnderline')
            const isCircle = child.marks && child.marks.includes('redCircle')

            // Split by spaces but keep punctuation with words
            const childWords = child.text
              .split(' ')
              .filter((word: string) => word.length > 0)
              .map((word: string) => {
                // If next word starts with punctuation, attach it to current word
                return word
              })

            childWords.forEach((word: string) => {
              words.push({ text: word, isHighlight, isUnderline, isCircle })
            })
          }
        })
      }
    })

    // Post-process to attach standalone punctuation to previous word
    const processedWords: Array<{
      text: string
      isHighlight: boolean
      isUnderline: boolean
      isCircle: boolean
    }> = []

    for (let i = 0; i < words.length; i++) {
      const currentWord = words[i]
      const nextWord = words[i + 1]

      // If current word is standalone punctuation, attach to previous word
      if (currentWord.text.match(/^[.,!?;:]+$/)) {
        if (processedWords.length > 0) {
          const lastWord = processedWords[processedWords.length - 1]
          lastWord.text = lastWord.text + currentWord.text
        }
      } else if (nextWord && nextWord.text.match(/^[.,!?;:]/)) {
        // If next word starts with punctuation, move it to current word
        const punctuation = nextWord.text.match(/^[.,!?;:]+/)?.[0] || ''
        const remainingText = nextWord.text.replace(/^[.,!?;:]+/, '')

        processedWords.push({
          text: currentWord.text + punctuation,
          isHighlight: currentWord.isHighlight,
          isUnderline: currentWord.isUnderline,
          isCircle: currentWord.isCircle,
        })

        // Update next word to remove the punctuation
        if (remainingText) {
          words[i + 1] = {
            text: remainingText,
            isHighlight: nextWord.isHighlight,
            isUnderline: nextWord.isUnderline,
            isCircle: nextWord.isCircle,
          }
        } else {
          // Skip the next word as it was just punctuation
          i++
        }
      } else {
        processedWords.push(currentWord)
      }
    }

    return processedWords
  }

  // Group consecutive words with same marks, keep unmarked words separate
  const groupMarkedWords = (
    words: Array<{
      text: string
      isHighlight: boolean
      isUnderline: boolean
      isCircle: boolean
    }>
  ) => {
    const groups: Array<{
      words: string[]
      isHighlight: boolean
      isUnderline: boolean
      isCircle: boolean
    }> = []
    let currentGroup: {
      words: string[]
      isHighlight: boolean
      isUnderline: boolean
      isCircle: boolean
    } | null = null

    words.forEach(word => {
      const hasAnyMark = word.isHighlight || word.isUnderline || word.isCircle
      const hasComma = word.text.includes(',')

      // For words with marks, group consecutive ones with same marks
      if (hasAnyMark) {
        const shouldStartNewGroup =
          !currentGroup ||
          currentGroup.isHighlight !== word.isHighlight ||
          currentGroup.isUnderline !== word.isUnderline ||
          currentGroup.isCircle !== word.isCircle

        if (shouldStartNewGroup) {
          if (currentGroup) groups.push(currentGroup)
          currentGroup = {
            words: [word.text], // Keep the word as-is, including any comma
            isHighlight: word.isHighlight,
            isUnderline: word.isUnderline,
            isCircle: word.isCircle,
          }
        } else {
          // Add to current group
          currentGroup?.words.push(word.text)
        }

        // If this word has a comma, end the current group after adding it
        if (hasComma) {
          groups.push(currentGroup as any)
          currentGroup = null
        }
      } else {
        // For unmarked words, create individual groups
        if (currentGroup) groups.push(currentGroup)

        groups.push({
          words: [word.text], // Keep the word as-is, including any comma
          isHighlight: false,
          isUnderline: false,
          isCircle: false,
        })
        currentGroup = null
      }
    })

    if (currentGroup) groups.push(currentGroup)
    return groups
  }

  const words = extractWordsWithMarks(richTextBlocks as any[])
  const wordGroups = groupMarkedWords(words)

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
        delayChildren: 0.2,
      },
    },
  }

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        opacity: { duration: 0.01 },
        y: { duration: 0.3 },
      },
    },
    hidden: {
      opacity: 0,
    },
  }

  return (
    <AnimatePresence>
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap justify-between gap-x-2 gap-y-3"
      >
        {wordGroups.map((group, groupIndex) => {
          // Calculate animation index for staggered effects
          const animateIndex = wordGroups
            .slice(0, groupIndex)
            .filter(g => g.isHighlight || g.isUnderline || g.isCircle).length

          const content = group.words.join(' ')

          return (
            <motion.span
              key={groupIndex}
              variants={child}
              className={classNames(
                'inline text-xl',
                group.isHighlight && 'highlight'
              )}
              style={
                group.isHighlight
                  ? ({
                      '--animate-delay': `${animateIndex * 0.2 + 1.2}s`,
                    } as React.CSSProperties)
                  : undefined
              }
            >
              {group.isUnderline ? (
                <RoughNotation
                  type="underline"
                  show={true}
                  color="#A90736"
                  strokeWidth={2.5}
                  iterations={1}
                  padding={-1}
                  animationDelay={animateIndex * 200 + 1200}
                  animationDuration={600}
                >
                  {content}
                </RoughNotation>
              ) : group.isCircle ? (
                <RoughNotation
                  type="circle"
                  show={true}
                  color="#A90736"
                  strokeWidth={2.5}
                  iterations={1}
                  animationDelay={animateIndex * 200 + 1200}
                  animationDuration={600}
                >
                  {content}
                </RoughNotation>
              ) : (
                content
              )}
            </motion.span>
          )
        })}
      </motion.div>
    </AnimatePresence>
  )
}

type ScrollingTextBlockProps = Omit<
  SanityBlockElement,
  keyof ScrollingTextBlockType
> &
  ScrollingTextBlockType

export const ScrollingTextBlock: FC<ScrollingTextBlockProps> = ({
  text,
  className,
}) => {
  return (
    <Block
      className={classNames(
        className,
        'w-wrap md:w-[calc(var(--wrap)+var(--space-x))] mx-auto mb-page'
      )}
    >
      <TypewriterText richTextBlocks={text as RichTextType} />
    </Block>
  )
}

export default ScrollingTextBlock
