import { defineCliConfig } from 'sanity/cli'

const DATASET = process.env.SANITY_STUDIO_API_DATASET

export default defineCliConfig({
  api: {
    projectId: 'glavz1o5',
    dataset: DATASET,
  },
  project: {
    basePath: '/studio',
  },
})
