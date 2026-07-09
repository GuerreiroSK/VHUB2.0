import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'

type Event = {
    id: number
    eventName: string
    location: string
    organizationId: number
    email: string
    startDateTime: string
    endDateTime: string
}
function EventsPage() {

    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        fetch('http://localhost:3000/api/events')
            .then(res => res.json())
            .then(data => setEvents(data))
    }, [])

  return (
    <div>
        <h1>Events Page</h1>
            {events.map(event => (
                <Link to = {`/events/${event.id}`} key = {event.id}>
                    <div>
                        <h2>{event.eventName}</h2>
                        <p>{event.location}</p>
                        <p>{event.startDateTime}</p>
                        <p>{event.endDateTime}</p>
                    </div>
                </Link>
            ))}
    </div>    
  )
}

export default EventsPage