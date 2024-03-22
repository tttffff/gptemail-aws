const OpenAI = require('openai')
const DiffMatchPatch = require('diff-match-patch')
const he = require('he')
const marked = require('marked')

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function fixEmail (input) {
  const systemPrompt = 'You are a proofreader. You receive an email as a prompt and return the corrected email. You just return the corrected text and nothing else. You fix spelling and grammar mistakes and any odd words or language that a non-native speaker might get wrong.'

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: input }]
  })

  return response.choices[0].message.content
}

function generateDiffHtml (original, corrected) {
  const dmp = new DiffMatchPatch()
  const diffs = dmp.diff_main(original, corrected)
  dmp.diff_cleanupSemantic(diffs)

  const diffHtml = diffs.map(([operation, text]) => {
    switch (operation) {
      case -1: return `<span class="removed">${he.encode(text)}</span>` // Deletion
      case 1: return `<span class="added">${he.encode(text)}</span>` // Insertion
      default: return text // No change (0)
    }
  }).join('')

  return diffHtml
}

exports.handler = async (event) => {
  try {
    const { emailInput } = JSON.parse(event.body)
    const proofreadEmail = await fixEmail(emailInput)
    const diff = generateDiffHtml(emailInput, proofreadEmail)
    const parsed = marked.parse(proofreadEmail)
    const returnObject = { emailInput, proofreadEmail, diff, parsed }
    return { statusCode: 200, body: JSON.stringify(returnObject) }
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ message: error.message }) }
  }
}
