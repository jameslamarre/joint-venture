import { HTMLAttributes, useRef, useState, type FC } from 'react'
import classNames from 'classnames'
import { SanityImage } from '@components/sanity'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import SCREENS from '@globals/screens'
import { Project } from '@studio/gen/sanity-schema'
import { RoughNotation } from 'react-rough-notation'
import { motion } from 'framer-motion'
import { SwiperOptions } from 'swiper/types'

interface ProjectsCarouselType extends HTMLAttributes<HTMLDivElement> {
  projects: Project[]
}

export const ProjectsCarousel: FC<ProjectsCarouselType> = ({
  projects,
  className,
}) => {
  const slidesRef = useRef<{ swiper: SwiperType } | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [showNotation, setShowNotation] = useState(false)

  const breakpoints: SwiperOptions['breakpoints'] = {
    0: {
      direction: 'vertical',
      loop: false,
    },
    [SCREENS.lg]: {
      direction: 'horizontal',
      loop: false,
    },
  }

  return (
    <div className={classNames(className, 'relative')}>
      <Swiper
        ref={slidesRef}
        modules={[Autoplay, Pagination]}
        breakpoints={breakpoints}
        spaceBetween={0}
        slidesPerView={1}
        speed={700}
        autoplay={{
          delay: 5000,
          disableOnInteraction: true,
        }}
        onSlideChange={swiper => {
          setActiveIndex(swiper.activeIndex)
          setShowNotation(false)
          setTimeout(() => setShowNotation(true), 800)
        }}
        onAfterInit={() => {
          setTimeout(() => setShowNotation(true), 800)
        }}
        pagination={{
          enabled: true,
        }}
        className={classNames(
          'relative w-full h-[100dvh] cursor-grab active:cursor-grabbing overflow-hidden'
        )}
      >
        {(projects as unknown as Project[])?.map((project, index) => (
          <SwiperSlide
            key={`carousel-images-${index}`}
            className="relative w-full h-[100dvh]"
          >
            <motion.div
              key="slide-block-content-key"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col absolute items-center lg:items-start justify-start px-x top-1/2 -translate-y-1/2 md:top-auto md:translate-y-0 md:bottom-[calc(var(--space-x)+160px)] text-white text-center lg:text-left z-above"
            >
              {project.titleImg || project.titleImgMobile ? (
                <>
                  {project.titleImg && (
                    <SanityImage
                      asset={project.titleImg.asset}
                      props={{
                        alt: project.title || 'Project title image',
                        sizes: '(max-width: 640px) 95vw, 90vw',
                      }}
                      className={classNames(
                        project.titleImgMobile ? 'hidden sm:block' : '',
                        'w-full lg:w-auto max-w-[850px] h-fit object-contain'
                      )}
                    />
                  )}

                  {project.titleImgMobile && (
                    <SanityImage
                      asset={project.titleImgMobile.asset}
                      props={{
                        alt: 'Film title image',
                        sizes: '(max-width: 640px) 95vw, 850px',
                        quality: 65,
                      }}
                      className={classNames(
                        'block sm:hidden w-full h-fit object-contain'
                      )}
                    />
                  )}
                </>
              ) : (
                project.title && (
                  <Link href={`/film/${project.slug?.current}`}>
                    <h1 className="text-h1 leading-none capitalize">
                      {project.title}
                    </h1>
                  </Link>
                )
              )}

              {project.subhead && (
                <p className="w-[200px] lg:w-fit uppercase font-sans text-md mt-yhalf pb-1">
                  <RoughNotation
                    type="underline"
                    show={showNotation}
                    color="#A90736"
                    strokeWidth={2.5}
                    iterations={1}
                    padding={0}
                    animationDuration={700}
                  >
                    {project.subhead}
                  </RoughNotation>
                </p>
              )}
            </motion.div>

            {project.previewImage && (
              <div className="absolute inset-0 z-0">
                <div className="absolute w-full h-full bg-black opacity-25 z-base"></div>
                <SanityImage
                  asset={project.previewImage.asset}
                  props={{
                    alt: 'image still',
                    sizes: '100vw',
                    quality: 90,
                  }}
                  className="relative w-full h-auto min-h-[100dvh] object-cover z-behind"
                />
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom pagination with RoughNotation */}
      <div className="swiper-pagination-custom absolute flex flex-col lg:flex-row lg:items-center items-end lg:justify-center gap-4 w-fit right-x lg:right-auto bottom-y lg:bottom-[100px] left-auto lg:left-1/2 transform lg:-translate-x-1/2 z-above">
        {projects.map((_, index) => (
          <button
            key={`pagination-${index}`}
            onClick={() => {
              if (slidesRef.current?.swiper) {
                slidesRef.current.swiper.slideTo(index)
              }
            }}
            className="relative w-3 h-3"
          >
            <RoughNotation
              type="circle"
              show={index === activeIndex}
              color="#A90736"
              strokeWidth={2}
              iterations={1}
              padding={7}
              animationDelay={100}
              animationDuration={200}
            >
              <span className="block w-3 h-3 rounded-full bg-white" />
            </RoughNotation>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ProjectsCarousel
