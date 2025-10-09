import type {
  SanityReference,
  SanityKeyedReference,
  SanityAsset,
  SanityImage,
  SanityFile,
  SanityGeoPoint,
  SanityBlock,
  SanityDocument,
  SanityImageCrop,
  SanityImageHotspot,
  SanityKeyed,
  SanityImageAsset,
  SanityImageMetadata,
  SanityImageDimensions,
  SanityImagePalette,
  SanityImagePaletteSwatch,
} from "sanity-codegen";

export type {
  SanityReference,
  SanityKeyedReference,
  SanityAsset,
  SanityImage,
  SanityFile,
  SanityGeoPoint,
  SanityBlock,
  SanityDocument,
  SanityImageCrop,
  SanityImageHotspot,
  SanityKeyed,
  SanityImageAsset,
  SanityImageMetadata,
  SanityImageDimensions,
  SanityImagePalette,
  SanityImagePaletteSwatch,
};

/**
 * Vimeo embed
 *
 *
 */
export interface Vimeo extends SanityDocument {
  _type: "vimeo";

  /**
   * Vimeo Video ID — `string`
   *
   *
   */
  vimeoId?: string;
}

/**
 * Youtube embed
 *
 *
 */
export interface Youtube extends SanityDocument {
  _type: "youtube";

  /**
   * Youtube Video ID — `string`
   *
   *
   */
  youtubeId?: string;
}

/**
 * Menus
 *
 *
 */
export interface Menus extends SanityDocument {
  _type: "menus";

  /**
   * Title — `string`
   *
   *
   */
  title?: string;

  /**
   * Menu Items — `array`
   *
   *
   */
  items?: Array<SanityKeyed<MenuItem>>;
}

/**
 * Page
 *
 *
 */
export interface Page extends SanityDocument {
  _type: "page";

  /**
   * Title — `string`
   *
   *
   */
  title?: string;

  /**
   * Slug — `slug`
   *
   *
   */
  slug?: { _type: "slug"; current: string };

  /**
   * Preview Image — `image`
   *
   *
   */
  previewImage?: {
    _type: "image";
    asset: SanityReference<SanityImageAsset>;
    crop?: SanityImageCrop;
    hotspot?: SanityImageHotspot;
  };

  /**
   * Initial Color — `string`
   *
   * Sets the initial color of the page before any transitions.
   */
  initialColor?: "stone" | "green";

  /**
   * Body — `blockContent`
   *
   *
   */
  body?: BlockContent;

  /**
   * SEO — `seo`
   *
   *
   */
  seo?: Seo;
}

/**
 * Project
 *
 *
 */
export interface Project extends SanityDocument {
  _type: "project";

  /**
   * Title — `string`
   *
   *
   */
  title?: string;

  /**
   * Slug — `slug`
   *
   *
   */
  slug?: { _type: "slug"; current: string };

  /**
   * Image — `image`
   *
   *
   */
  previewImage?: {
    _type: "image";
    asset: SanityReference<SanityImageAsset>;
    crop?: SanityImageCrop;
    hotspot?: SanityImageHotspot;
  };

  /**
   * Initial Color — `string`
   *
   * Sets the initial color of the page before any transitions.
   */
  initialColor?: "stone" | "green";

  /**
   * Trailer — `embed`
   *
   *
   */
  trailer?: Embed;

  /**
   * Featured — `boolean`
   *
   *
   */
  featured?: boolean;

  /**
   * Directed By — `string`
   *
   *
   */
  directedBy?: string;

  /**
   * Written By — `string`
   *
   *
   */
  writtenBy?: string;

  /**
   * Produced By — `string`
   *
   *
   */
  producedBy?: string;

  /**
   * Starring — `string`
   *
   *
   */
  starring?: string;

  /**
   * Other Fields — `array`
   *
   * Add any other fields you want to display with project details.
   */
  otherFields?: Array<
    SanityKeyed<{
      _type: "other";
      /**
       * Title — `string`
       *
       *
       */
      title?: string;

      /**
       * Value — `string`
       *
       *
       */
      value?: string;
    }>
  >;

  /**
   * Synopsis — `plainText`
   *
   *
   */
  synopsis?: PlainText;

  /**
   * CTA — `cta`
   *
   *
   */
  cta?: Cta;

  /**
   * SEO — `seo`
   *
   *
   */
  seo?: Seo;
}

/**
 * Site Settings
 *
 *
 */
export interface SiteSettings extends SanityDocument {
  _type: "siteSettings";

  /**
   * Site Title — `string`
   *
   *
   */
  title?: string;

  /**
   * Footer Socials — `array`
   *
   * Social media links to display in the footer
   */
  footerSocials?: Array<
    SanityKeyed<{
      _type: "social";
      /**
       * Title — `string`
       *
       *
       */
      title?: string;

      /**
       * URL — `url`
       *
       *
       */
      url?: string;

      /**
       * Icon — `image`
       *
       *
       */
      icon?: {
        _type: "image";
        asset: SanityReference<SanityImageAsset>;
        crop?: SanityImageCrop;
        hotspot?: SanityImageHotspot;
      };
    }>
  >;

  /**
   * Newsletter Audience ID — `string`
   *
   * The ID of the Mailchimp audience for the newsletter
   */
  newsletterId?: string;

  /**
   * Site Description — `text`
   *
   *
   */
  description?: string;

  /**
   * Site Image — `image`
   *
   *
   */
  image?: {
    _type: "image";
    asset: SanityReference<SanityImageAsset>;
    crop?: SanityImageCrop;
    hotspot?: SanityImageHotspot;
  };

  /**
   * Keyphrase — `string`
   *
   * Phrase that you want your site to rank for.
   */
  siteKeywords?: string;

  /**
   * Main Menu — `reference`
   *
   * Select menu for main navigation
   */
  mainMenu?: SanityReference<Menus>;
}

export type Link = {
  _type: "link";
  /**
   * Internal link — `object`
   *
   *
   */
  internalLink?: {
    _type: "internalLink";
    /**
     * reference — `reference`
     *
     *
     */
    reference?: SanityReference<Page>;
  };

  /**
   * External Link — `url`
   *
   *
   */
  externalLink?: string;
};

export type Accordion = {
  _type: "accordion";
  /**
   * Accordion Header — `string`
   *
   *
   */
  header?: string;

  /**
   * Accordion Text — `richText`
   *
   *
   */
  text?: RichText;
};

export type Color = "black" | "white";

export type Cta = {
  _type: "cta";
  /**
   * Text — `string`
   *
   *
   */
  text?: string;

  /**
   * Link — `link`
   *
   *
   */
  link?: Link;
};

export type Divider = {
  _type: "divider";
  /**
   * Divider — `boolean`
   *
   *
   */
  divider?: boolean;
};

export type Embed = {
  _type: "embed";
  /**
   * vimeo — `vimeo`
   *
   *
   */
  vimeo?: Vimeo;

  /**
   * youtube — `youtube`
   *
   *
   */
  youtube?: Youtube;

  /**
   * poster — `image`
   *
   * Image that displays before the video is fully loaded
   */
  poster?: {
    _type: "image";
    asset: SanityReference<SanityImageAsset>;
    crop?: SanityImageCrop;
    hotspot?: SanityImageHotspot;
  };
};

export type Figure = {
  _type: "figure";
  /**
   * Media — `media`
   *
   *
   */
  media?: Media;
};

export type Media = {
  _type: "media";
  /**
   * image — `image`
   *
   *
   */
  image?: {
    _type: "image";
    asset: SanityReference<SanityImageAsset>;
    crop?: SanityImageCrop;
    hotspot?: SanityImageHotspot;
  };

  /**
   * Alt Text — `string`
   *
   * Describe the image for better accessibility
   */
  alt?: string;

  /**
   * Video — `video`
   *
   *
   */
  video?: Video;

  /**
   * Embed — `embed`
   *
   *
   */
  embed?: Embed;

  /**
   * Caption — `richText`
   *
   *
   */
  caption?: RichText;
};

export type MenuItem = {
  _type: "menuItem";
  /**
   * Menu Item Text — `string`
   *
   *
   */
  text?: string;

  /**
   * Menu Item URL — `link`
   *
   *
   */
  link?: Link;
};

export type Seo = {
  _type: "seo";
  /**
   * SEO Title — `string`
   *
   *
   */
  title?: string;

  /**
   * Meta Description — `string`
   *
   *
   */
  description?: string;

  /**
   * Keyphrase — `string`
   *
   * A phrase that you want your post or page to rank for.
   */
  keywords?: string;

  /**
   * Keyword/Keyphrase Synonyms — `string`
   *
   *
   */
  synonyms?: string;
};

export type RichText = Array<
  SanityKeyed<SanityBlock> | SanityKeyed<Media> | SanityKeyed<Cta>
>;

export type PlainText = Array<SanityKeyed<SanityBlock>>;

export type Video = {
  _type: "video";
  /**
   * files — `array`
   *
   * Video files (webm, m4v, mp4) beginning with webm
   */
  files?: Array<SanityKeyed<{ _type: "file"; asset: SanityReference<any> }>>;

  /**
   * poster — `image`
   *
   * Image that displays before the video is loaded
   */
  poster?: {
    _type: "image";
    asset: SanityReference<SanityImageAsset>;
    crop?: SanityImageCrop;
    hotspot?: SanityImageHotspot;
  };

  /**
   * loop — `boolean`
   *
   *
   */
  loop?: boolean;

  /**
   * autoplay — `boolean`
   *
   * Video will be muted if autoplay is enabled
   */
  autoplay?: boolean;
};

export type BlockContent = Array<
  | SanityKeyed<AccordionBlock>
  | SanityKeyed<DividerBlock>
  | SanityKeyed<EmbedBlock>
  | SanityKeyed<FiguresBlock>
  | SanityKeyed<MediaBlock>
  | SanityKeyed<ProjectsBlock>
  | SanityKeyed<ScrollingTextBlock>
  | SanityKeyed<TextBlock>
  | SanityKeyed<TextAndImageBlock>
>;

export type AccordionBlock = {
  _type: "accordionBlock";
  /**
   * Accordions — `array`
   *
   *
   */
  accordions?: Array<SanityKeyed<Accordion>>;
};

export type DividerBlock = {
  _type: "dividerBlock";
  /**
   * border — `boolean`
   *
   *
   */
  border?: boolean;
};

export type EmbedBlock = {
  _type: "embedBlock";
  /**
   * Embed — `text`
   *
   * Paste the embed code here
   */
  embed?: string;
};

export type FiguresBlock = {
  _type: "figuresBlock";
  /**
   * header — `richText`
   *
   *
   */
  header?: RichText;

  /**
   * Figures — `array`
   *
   *
   */
  figures?: Array<SanityKeyed<Figure>>;

  /**
   * Column Count — `number`
   *
   *
   */
  columns?: number;
};

export type MediaBlock = {
  _type: "mediaBlock";
  /**
   * Media — `media`
   *
   *
   */
  media?: Media;
};

export type ProjectsBlock = {
  _type: "projectsBlock";
  /**
   * Projects — `array`
   *
   *
   */
  projects?: Array<SanityKeyedReference<Project>>;
};

export type ScrollingTextBlock = {
  _type: "scrollingTextBlock";
  /**
   * Text — `richText`
   *
   *
   */
  text?: RichText;
};

export type TextBlock = {
  _type: "textBlock";
  /**
   * Text — `richText`
   *
   *
   */
  text?: RichText;
};

export type TextAndImageBlock = {
  _type: "textAndImageBlock";
  /**
   * Text — `richText`
   *
   *
   */
  text?: RichText;

  /**
   * Media — `media`
   *
   *
   */
  media?: Media;

  /**
   * Show Image First — `boolean`
   *
   *
   */
  showImageFirst?: boolean;
};

export type Documents = Vimeo | Youtube | Menus | Page | Project | SiteSettings;
