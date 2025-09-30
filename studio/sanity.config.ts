import { defineConfig } from 'sanity'
import { schemaTypes } from './schemas'
import { deskTool } from 'sanity/desk'
import { vercelDeployTool } from 'sanity-plugin-vercel-deploy'
import { media } from 'sanity-plugin-media'
import deskStructure, { getDefaultDocumentNode } from './parts/desk-structure'

const DATASET = process.env.SANITY_STUDIO_API_DATASET

export default defineConfig({
  name: 'default',
  title: 'Joint Venture',
  projectId: 'glavz1o5',
  dataset: DATASET,
  plugins: [
    deskTool({
      structure: deskStructure,
      defaultDocumentNode: getDefaultDocumentNode,
    }),
    vercelDeployTool(),
    media(),
  ],
  schema: {
    types: schemaTypes,
  },
  parts: [
    {
      name: 'part:@sanity/base/schema',
      path: './schemas/index',
    },
    {
      implements: 'part:@sanity/production-preview/resolve-production-url',
      path: './parts/resolve-production-url',
    },
  ],
})
