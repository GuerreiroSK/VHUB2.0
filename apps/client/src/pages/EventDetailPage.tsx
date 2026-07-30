import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

    function handleRegisterMessage() {

        if (!user) {
            setWarningMessage('To participate in an event, you must be logged in. Or create and account here(...).')
            return
        }
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
        })
    }

    useEffect(() => {
        fetch(`http://localhost:3000/api/events/${id}`)
        .then(res => res.json())
        .then(data => setEventDetails(data))
    }, [])

    if(!eventDetails) return <p>Loading...</p>
    
    return (

        <div>
            <div className="w-full h-screen flex items-start bg-orange-500 justify-center p-48">
                <h1 className="text-white font-bold tracking-normal text-7xl">{eventDetails.eventName}</h1>
            </div>
            <div className="flex items-center flex-col bg-orange-200 text-black text-xl justify-center p-4">
                <p>{eventDetails.location}</p>
                <p>Starts: {new Date(eventDetails.startDateTime).toLocaleString()}</p>
                <p>Ends: {new Date(eventDetails.endDateTime).toLocaleString()}</p>
                <p>{eventDetails.email}</p>
            </div>
            <button onClick={handleRegisterMessage} 
                className = "fixed bottom-8 right-8 bg-white/20 backdrop-blur-sm border border-white/30 text-black px-6 py-3 rounded-full shadow-lg z-50 drop-shadow-lg">
                    Register to this event!
            </button> {warningMessage && <p>{warningMessage}</p>}
        </div>
    )
}

export default EventDetailPage;
