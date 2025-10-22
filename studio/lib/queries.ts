/* Sanity query partials for DRYness */

export const IMAGE_QUERY = `
  ...,
  "asset": asset{
    ...,
    _type == 'reference' => @->,
    _type != 'reference' => @,
  },
`
export const MEDIA_QUERY = `
  ...,
  "image": image{
    ${IMAGE_QUERY}
  },
`

export const LINK_QUERY = `
  externalLink,
  "internalLink": internalLink.reference->{
    _type,
    slug,
    // Include parent microsite for microsite pages
    _type == "micrositePage" => {
      "microsite": microsite->{ slug }
    }
  },
  "anchor": internalLink.anchor,
`

export const LINK_MARKDEFS_QUERY = `
  _type == "link" => {
    externalLink,
    "internalLink": @.internalLink.reference->{
      _type,
      slug,
      // Include parent microsite for microsite pages
      _type == "micrositePage" => {
        "microsite": microsite->{ slug }
      }
    },
    "anchor": @.internalLink.anchor,
  },
`

export const CTA_QUERY = `
  text,
  "link": link{
    ${LINK_QUERY}
  },
  color,
`

export const BODY_QUERY = `
  "body": body[]{
    ...,
    "text": text[]{
      ...,
      markDefs[]{
        ...,
        ${LINK_MARKDEFS_QUERY}
      },
      cta{
        ${CTA_QUERY}
      },
    },
    "media": media{
      ${MEDIA_QUERY}
    },
    cta{
      ${CTA_QUERY}
    },
    ctas[]{
      ...,
      cta{
        ${CTA_QUERY}
      },
    },
    "projects": projects[]->{
      type,
      slug,
      title,
      previewImage{
        ${IMAGE_QUERY}
      },
      trailer, 
      featured, 
      directedBy,
      writtenBy,
      producedBy,
      starring,
      otherFields,
      synopsis,
      cta{
        ${CTA_QUERY}
      },
    },
    "images": images[]{
      ${IMAGE_QUERY}
    },
    "ticketsCta": ticketsCta{
      ${CTA_QUERY}
    },
  },
`
