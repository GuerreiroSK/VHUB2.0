import { useState, useEffect } from 'react';

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
        {events.map(event => (
            <div key={event.id}>
                <h2>{event.eventName}</h2>
                <p>{event.location}</p>
            </div>
        ))}
    </div>    
  )
}

export default EventsPage