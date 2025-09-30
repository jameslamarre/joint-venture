/**
 * Extracts plain text from Portable Text blocks
 * @param blocks - The Portable Text blocks to extract text from
 * @returns Plain text string from all text content
 */
export const extractTextFromBlocks = (blocks: any): string => {
  if (!blocks) return ''

  // Handle array of blocks
  if (Array.isArray(blocks)) {
    return blocks.map(block => extractTextFromBlocks(block)).join(' ')
  }

  // Handle text blocks
  if (blocks.children && Array.isArray(blocks.children)) {
    return blocks.children.map((child: any) => child.text || '').join(' ')
  }

  // Handle nested structure
  if (blocks.text) {
    return blocks.text
  }

  return ''
}
