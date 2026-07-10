import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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

function OrganizationsPage () {

    const [organizations, setOrganizations] = useState<Organization[]>([]);
    
    useEffect(() => {
        fetch('http://localhost:3000/api/organizations')
            .then(res => res.json())
            .then(data => setOrganizations(data))
    }, [])
    

    return(
        <>
            <h1>Organizations Page</h1>
              {organizations.map(organization => (
                <Link to = {`/organizations/${organization.id}`} key = {organization.id}>
                    <div>
                        <h2>{organization.name}</h2>
                        <p>{organization.email}</p>
                        <p>{organization.description}</p>
                        <p>{organization.location}</p>
                    </div>
                </Link>
            ))}
        </>
    )
}

export default OrganizationsPage