import { type FC, type HTMLProps } from 'react'
import classNames from 'classnames'
import {
  IconFacebook,
  IconInstagram,
  IconLogoFull,
  IconTiktok,
  IconYoutube,
} from '@components/icons'
import Link from 'next/link'

type SocialsProps = {
  socials: {
    instagram?: string
    youtube?: string
    tiktok?: string
    facebook?: string
  }
  youtubeFill?: string
}

export const Socials: FC<SocialsProps & HTMLProps<HTMLDivElement>> = ({
  socials,
  youtubeFill,
  className,
}) => {
  return (
    <ul className={className}>
      {socials.instagram && (
        <li>
          <Link
            href={socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-auto h-fit hover:text-[var(--theme-highlight)]"
          >
            <IconInstagram className="w-auto h-10" />
          </Link>
        </li>
      )}

      {socials.youtube && (
        <li>
          <Link
            href={socials.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-auto h-fit hover:text-[var(--theme-highlight)]"
          >
            <IconYoutube
              youtubefill={youtubeFill as string}
              className="w-auto h-7"
            />
          </Link>
        </li>
      )}

      {socials.tiktok && (
        <li>
          <Link
            href={socials.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-auto h-fit hover:text-[var(--theme-highlight)]"
          >
            <IconTiktok className="w-auto h-10" />
          </Link>
        </li>
      )}

      {socials.facebook && (
        <li>
          <Link
            href={socials.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-auto h-fit hover:text-[var(--theme-highlight)]"
          >
            <IconFacebook className="w-auto h-7" />
          </Link>
        </li>
      )}
    </ul>
  )
}

export default Socials
