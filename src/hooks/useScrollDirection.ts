import { useEffect, useState } from 'react'

export function useScrollDirection() {
    const [visible, setVisible] = useState(true)
    const [lastY, setLastY] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY
            if (currentY < 10) {
                setVisible(true)
            } else if (currentY > lastY + 5) {
                setVisible(false)
            } else if (currentY < lastY - 5) {
                setVisible(true)
            }
            setLastY(currentY)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [lastY])

    return visible
}