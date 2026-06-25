import { useEffect, useRef } from 'react'

/**
 * useReveal
 * Observa todos los elementos con [data-reveal] dentro del contenedor
 * y les agrega la clase `revealed` cuando entran en el viewport.
 *
 * Uso en JSX:
 *   <div data-reveal data-reveal-delay="100"> ... </div>
 *
 * El atributo data-reveal-delay acepta milisegundos (0–800).
 */
export function useReveal() {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const targets = container.querySelectorAll<HTMLElement>('[data-reveal]')

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
    }, [])

    return containerRef
}