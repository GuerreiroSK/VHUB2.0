import { useState, useEffect } from "react"

function Carousel() {

    const slides = [
        { id: 1, label: 'Image1', bg: 'bg-blue-500' },
        { id: 2, label: 'Image2', bg: 'bg-green-500' },
        { id: 3, label: 'Image3', bg: 'bg-yellow-500' },
        { id: 4, label: 'Image4', bg: 'bg-red-500' },
        { id: 5, label: 'Image5', bg: 'bg-orange-500' },
    ]

    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % slides.length)
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className={`${slides[currentIndex].bg} h-screen w-screen flex items-center justify-center text-white text-2xl font-bold`}>
            {slides[currentIndex].label}
        </div>
    )
}

export default Carousel