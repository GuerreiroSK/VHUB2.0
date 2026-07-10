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
            <h1>{eventDetails.eventName}</h1>
            <p>{eventDetails.location}</p>
            <p>{eventDetails.startDateTime}</p>
            <p>{eventDetails.endDateTime}</p>
            <p>{eventDetails.email}</p>
            <button onClick={handleRegisterMessage}>Register</button>
            {warningMessage && <p>{warningMessage}</p>}
        </div>
    )
}

export default EventDetailPage;
