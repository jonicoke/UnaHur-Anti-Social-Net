// useReveal.ts
import { useEffect, useRef } from 'react'

export function useReveal(deps: unknown[] = []) {   // ← acepta deps
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const targets = container.querySelectorAll<HTMLElement>('[data-reveal]:not(.revealed)')  // ← solo los no revelados

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return
                    const el = entry.target as HTMLElement
                    const delay = el.dataset.revealDelay ?? '0'
                    setTimeout(() => {
                        el.classList.add('revealed')
                    }, Number(delay))
                    observer.unobserve(el)
                })
            },
            { threshold: 0.08 }
        )

        targets.forEach((el) => observer.observe(el))

        return () => observer.disconnect()
    }, deps)   // ← re-ejecuta cuando cambian las deps

    return containerRef
}