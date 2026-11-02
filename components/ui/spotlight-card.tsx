'use client'

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import type { ElementType, PointerEvent, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function useSpotlightHandlers() {
  return {
    onPointerMove: (event: PointerEvent<HTMLElement>) => {
      const rect = event.currentTarget.getBoundingClientRect()
      event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`)
      event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`)
    },
  }
}

export function SpotlightCard({
  as: Tag = 'div',
  className,
  children,
}: {
  as?: ElementType
  className?: string
  children: ReactNode
}) {
  const handlers = useSpotlightHandlers()
  return (
    <Tag className={cn('spotlight', className)} {...handlers}>
      {children}
    </Tag>
  )
}

export function TiltCard({
  children,
  className,
  intensity = 6,
}: {
  children: ReactNode
  className?: string
  intensity?: number
}) {
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), {
    stiffness: 200,
    damping: 18,
  })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), {
    stiffness: 200,
    damping: 18,
  })
  const lift = useSpring(0, { stiffness: 220, damping: 20 })

  return (
    <motion.div
      className={cn('h-full [perspective:1000px]', className)}
      onPointerMove={(event) => {
        if (reduce || event.pointerType !== 'mouse') return
        const rect = event.currentTarget.getBoundingClientRect()
        x.set((event.clientX - rect.left) / rect.width - 0.5)
        y.set((event.clientY - rect.top) / rect.height - 0.5)
        lift.set(-6)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
        lift.set(0)
      }}
    >
      <motion.div
        className="h-full will-change-transform"
        style={{ rotateX, rotateY, y: lift, transformStyle: 'preserve-3d' }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
