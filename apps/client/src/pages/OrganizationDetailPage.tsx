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
            <h1>{organizationDetails.name}</h1>
            <p>{organizationDetails.location}</p>
            <p>{organizationDetails.createdAt}</p>
            <p>{organizationDetails.description}</p>
            <p>{organizationDetails.email}</p>

            <h2>Our events!</h2>
            {events.map(event => (
                <Link to={`/events/${event.id}`} key = {event.id}>
                    <div>
                        <h3>{event.eventName}</h3>
                        <p>{event.location}</p>
                        <p>{event.startDateTime}</p>
                        <p>{event.endDateTime}</p>
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default OrganizationDetailPage;