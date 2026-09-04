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
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

    useEffect(() => {
        fetch('http://localhost:3000/api/events')
            .then(res => res.json())
            .then(data => {
                setEvents(data)
                setSelectedEvent(data[Math.floor(Math.random() * data.length)])
            })    
    }, [])

    const upcomingEvents = events.filter(event => new Date(event.startDateTime) > new Date())
    const pastEvents = events.filter(event => new Date(event.startDateTime) <= new Date())

  return (
    <div>
        <div className='w-full h-[500px] bg-orange-500 pt-28'>
            {selectedEvent && <h2 className='text-white text-5xl font-bold text-center'>{selectedEvent.eventName}</h2>}
        </div>
        <h2 className='p-4 text-2xl font-bold font-serif border-b border-gray-300 pb-2 mb-2'>Upcoming events:</h2>
        <div className='grid grid-cols-5 gap-4 p-4'>
            {upcomingEvents.map(event => (
                <div key={event.id} onClick={() => setSelectedEvent(event)}>
                    <div className='min-w-[200px] flex-1 bg-white rounded-xl shadow-lg p-2'>
                        <h2>{event.eventName}</h2>
                        <p>{event.location}</p>
                        <p>Starts: {new Date(event.startDateTime).toLocaleString()}</p>
                        <p>Ends: {new Date(event.endDateTime).toLocaleString()}</p>
                        <Link to={`/events/${event.id}`} className='bg-orange-500 text-white w-full rounded-lg py-2 text-center mt-2 block'>View event details</Link>
                    </div>
                </div>
            ))}
        </div>
        <h2 className='p-4 text-2xl font-bold font-serif border-b border-gray-300 pb-2 mb-2'>Past events:</h2>
        <div className='grid grid-cols-5 gap-4 p-4'>
            {pastEvents.map(event => (
                <div key={event.id}>
                    <div className='bg-amber-50 text-gray-400 opacity-90 rounded-xl shadow-lg p-2'>
                        <h2>{event.eventName}</h2>
                        <p>{event.location}</p>
                        <p>Ended at: {new Date(event.endDateTime).toLocaleString()}</p>
                    </div>
                </div>
            ))}    
        </div>
        <div className='flex flex-row justify-around pt-8 opacity-50 font-bold text-lg'>
            <p>logo1</p>
            <p>logo2</p>
            <p>logo3</p>
            <p>logo4</p>
            <p>logo5</p>
            <p>logo6</p>
            <p>logo7</p>
            <p>logo8</p>
        </div> 
    </div>
  )
}

export default EventsPage