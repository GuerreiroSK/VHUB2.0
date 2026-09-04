import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Event = {
    id: number
    eventName: string
    location: string
    organizationId: number
    email: string
    startDateTime: string
    endDateTime: string
}

function EventDetailPage() {

    const { id } = useParams();

    const { user } = useAuth();

    const [eventDetails, setEventDetails] = useState<Event | null>(null)
    const [warningMessage, setWarningMessage] = useState('')
    const [showConfirmModal , setShowConfirmModal] = useState(false)
    const [showResultModal, setShowResultModal] = useState(false)
    const [scrollAtBottom, setScrollAtBottom] = useState(false)

    function handleRegisterMessage() {

        if (!user) {
            setWarningMessage('To participate in an event, you must be logged in. Or create and account here(...).')
            window.scrollTo({ top: 0, behavior: 'smooth' })
            return
        }
        setShowConfirmModal(true)
    }

    function confirmRegistration() {

        if (!user) return

        fetch(`http://localhost:3000/api/events/${id}/attendees`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
            .then(res => res.json().then(data => ({ ok: res.ok, data })))
            .then(({ ok, data }) => {
                if (ok) {
                    setWarningMessage('Successfully registered for this event!')
                } else {
                    setWarningMessage(data.message)
                }
            setShowResultModal(true)
            })
        setShowConfirmModal(false)    
    }

    useEffect(() => {
        fetch(`http://localhost:3000/api/events/${id}`)
            .then(res => res.json())
            .then(data => setEventDetails(data))
    }, [])

    useEffect(() => {
    function handleScroll() {
        if (window.scrollY + window.innerHeight > document.body.scrollHeight -150) {
            setScrollAtBottom(true)
        } else {
            setScrollAtBottom(false)
        }
    }
    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)

    }, [])

    if (!eventDetails) return <p>Loading...</p>

    return (

        <div>
            <div className="w-full h-screen flex items-start bg-orange-500 justify-center p-48">
                <h1 className="text-white font-bold tracking-normal text-7xl">{eventDetails.eventName}</h1>
                {warningMessage && (
                    <div>
                        {!user && (
                            <>
                                <Link to='/login' className='bg-white text-orange-500 px-4 py-2 rounded-full mr-2'>Login</Link>
                                <Link to='/register' className='bg-orange-700 text-white px-4 py-2 rounded-full'>Register</Link>
                            </>
                        )}
                    </div>
                )}
            </div>
            <div className="bg-orange-200 text-black text-xl justify-center p-4">
                <div className="grid grid-cols-3 gap-4">
                    <div className="relative rounded-3xl overflow-hidden h-96 bg-white">
                        <div className='absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-4 text-black text-center flex flex-col justify-between'>
                            <h2 className='mb-4'>{eventDetails.location}</h2>
                            <div className='flex justify-center'>
                                <Link to={``} className='bg-orange-400 text-white inline-block rounded-3xl py-2 text-center mt-2 px-4'>Show on map!</Link>
                            </div>
                        </div>
                    </div>
                    <div className="relative rounded-3xl overflow-hidden h-96 bg-white">
                        <div className='absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-4 text-black text-center flex flex-col justify-between'>
                            <div>
                                <p>Starts: {new Date(eventDetails.startDateTime).toLocaleString()}</p>
                                <p>Ends: {new Date(eventDetails.endDateTime).toLocaleString()}</p>
                            </div>
                            <div className='flex justify-center'>
                                <Link to={``} className='bg-orange-400 text-white inline-block rounded-3xl py-2 text-center mt-2 px-4'>See on calendar!</Link>
                            </div>
                        </div>
                    </div>
                    <div className="relative rounded-3xl overflow-hidden h-96 bg-white">
                        <div className='absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-4 text-black text-center flex flex-col justify-between'>
                            <p>{eventDetails.email}</p>
                            <div className='flex justify-center'>
                                <a href={`mailto:${eventDetails.email}`} className='bg-orange-400 text-white inline-block rounded-3xl py-2 text-center mt-2 px-4'>Contact us!</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button onClick={handleRegisterMessage}
                className={`fixed bottom-8 right-8 bg-white/20 backdrop-blur-sm border border-white/30 text-black px-6 py-3 rounded-full shadow-lg z-50 drop-shadow-lg transition-all duration-500 
                ${scrollAtBottom ? '-translate-y-[calc(100vh-120px)]' : 'translate-y-0'}`}>
                Register to this event!
            </button>
            {showConfirmModal && (
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-8 w-96 drop-shadow-lg">
                    You're registering to the {eventDetails.eventName} at this day and time: {new Date(eventDetails.startDateTime).toLocaleString()}, do you confirm? 
                    <div className="flex gap-4 mt-4 justify-center">
                        <button 
                            onClick={confirmRegistration}
                            className="bg-orange-500 text-white px-4 py-2 rounded-full">
                            Confirm!
                        </button>
                        <button 
                            onClick={() => setShowConfirmModal(false)}
                            className="bg-gray-200 text-black px-4 py-2 rounded-full">
                            Cancel...
                        </button>
                    </div>
                </div>
            )}
            {showResultModal && (
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-8 w-96 drop-shadow-lg">
                    <div>
                        <p>{warningMessage}</p>
                    </div>
                    <div className="flex gap-4 mt-4 justify-center">
                        <button onClick={() => setShowResultModal(false)}
                            className="bg-gray-200 text-black px-4 py-2 rounded-full">
                            Ok!
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default EventDetailPage;
