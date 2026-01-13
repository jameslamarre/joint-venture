import { GrSettingsOption } from 'react-icons/gr'
import { RiFileList3Line } from 'react-icons/ri'
import { GiFilmProjector, GiFilmSpool } from 'react-icons/gi'
import { StructureBuilder } from 'sanity/desk'
import type { SanityDocument } from '@sanity/types'
import Iframe from 'sanity-plugin-iframe-pane'
import resolveProductionUrl from './resolve-production-url'

export const getDefaultDocumentNode = (S: StructureBuilder) => {
  return S.document().views([
    S.view.form(),
    S.view
      .component(Iframe)
      .options({
        url: async (doc: SanityDocument) => await resolveProductionUrl(doc),
      })
      .title('Preview'),
  ])
}

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Pages')
        .child(S.documentTypeList('page').title('Pages'))
        .icon(RiFileList3Line),
      S.divider(),
      S.listItem()
        .title('Projects')
        .child(S.documentTypeList('project').title('Projects'))
        .icon(GiFilmProjector),
      S.divider(),
      S.listItem()
        .title('Settings')
        .icon(GrSettingsOption)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site Settings')
        ),
      S.divider(),
      S.divider(),
      S.listItem()
        .title('Microsites')
        .child(S.documentTypeList('microsite').title('Microsites'))
        .icon(GiFilmSpool),
    ])

export default deskStructure
