'use client'

import { useState } from 'react'

export interface ImageData {
  url: string
  thumbnail: string
}

interface ImageCarouselProps {
  images: ImageData[]
  alt?: string
  aspectRatio?: 'square' | 'landscape' | 'linkedin'
}

export function ImageCarousel({ images, alt = 'Post image', aspectRatio = 'landscape' }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (images.length === 0) return null

  const aspectClasses = {
    square: 'aspect-[4/5]', // Instagram-style portrait
    landscape: 'aspect-[16/10]', // Wider LinkedIn-style
    linkedin: 'aspect-video',
  }

  const goToPrevious = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const goToIndex = (e: React.MouseEvent, index: number) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex(index)
  }

  // Single image - no carousel controls needed
  if (images.length === 1) {
    return (
      <div className={`relative ${aspectClasses[aspectRatio]} bg-gray-100 overflow-hidden`}>
        <img
          src={images[0].thumbnail || images[0].url}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
    )
  }

  // Multiple images - show carousel with controls
  return (
    <div className={`relative ${aspectClasses[aspectRatio]} bg-gray-100 overflow-hidden group`}>
      {/* Current image */}
      <img
        src={images[currentIndex].thumbnail || images[currentIndex].url}
        alt={`${alt} ${currentIndex + 1} of ${images.length}`}
        className="w-full h-full object-cover transition-opacity duration-200"
      />

      {/* Navigation arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
        aria-label="Previous image"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
        aria-label="Next image"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={(e) => goToIndex(e, index)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-white w-2.5'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      {/* Image counter badge */}
      <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
        {currentIndex + 1}/{images.length}
      </div>
    </div>
  )
}
