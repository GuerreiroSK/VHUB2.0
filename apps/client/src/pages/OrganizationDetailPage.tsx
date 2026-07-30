import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

type Organization = {
    id: number
    name: string
    email: string
    description: string
    location: string
    createdAt: string
    deletedAt: string
    ownerId: number
}

type Event = {
    id: number
    eventName: string
    location: string
    organizationId: number
    email: string
    startDateTime: string
    endDateTime: string
}

function OrganizationDetailPage() {

    const { id } = useParams();

    const [organizationDetails, setOrganizationDetails] = useState<Organization | null>(null)
    const [events, setEvents] = useState<Event[]>([])


    useEffect(() => {
        fetch(`http://localhost:3000/api/organizations/${id}`)
        .then(res => res.json())
        .then(orgData => setOrganizationDetails(orgData))
    }, [])

    useEffect(() => {
        fetch(`http://localhost:3000/api/organizations/${id}/events`)
        .then(res => res.json())
        .then(eventData => setEvents(eventData))
    }, [])

    if(!organizationDetails) return <p>Loading...</p>
    
    return (

        <div>
            <div className="w-full h-screen flex items-start bg-orange-500 justify-center p-48">
                <h1 className="text-white font-bold tracking-normal text-7xl">{organizationDetails.name}</h1>
            </div>
            <div className="flex items-center flex-col bg-orange-200 text-black text-xl justify-center p-4">
                <p>{organizationDetails.description}</p>
                <p>{organizationDetails.location}</p>
                <p>{organizationDetails.email}</p>
            </div>
            <div>
                <h2 className="p-4 text-2xl font-bold font-serif border-b border-gray-300 pb-2 mb-2 text-center bg-orange-700 text-white">Our events!</h2>
                <div className="grid grid-cols-5 gap-4 px-16">
                    {events.map(event => (
                        <div key = {event.id} className='relative rounded-3xl overflow-hidden h-96 bg-orange-400'>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-4 text-white flex flex-col justify-end">
                                <h3>{event.eventName}</h3>
                                <p>{event.location}</p>
                                <p>{event.startDateTime}</p>
                                <p>{event.endDateTime}</p>
                                <div className='flex justify-center'>
                                    <Link to={`/events/${event.id}`} className='bg-orange-400 text-white inline-block rounded-3xl py-2 text-center mt-2 px-4'>Event details</Link>
                                </div>    
                            </div>
                        </div>
                    ))}
                </div>    
            </div>
        </div>
     
    )
}

export default OrganizationDetailPage;