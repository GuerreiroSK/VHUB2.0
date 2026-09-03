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
        <div className='w-full min-h-screen bg-orange-300 pt-32'>
            <h1 className='p-4 text-2xl font-bold font-serif border-b border-gray-300 pb-2 mb-2 text-center'>Organizations / Partners</h1>
            <div className='grid grid-cols-5 gap-4 px-16'>
                {organizations.map(organization => (
                    <div key={organization.id}
                        className='relative rounded-3xl overflow-hidden h-96'
                        style={{backgroundImage: 'url(https://media.istockphoto.com/id/1625310710/photo/happy-group-of-volunteer-people-stacking-hands-celebrating-together-outdoor-teamwork-and.jpg?s=612x612&w=0&k=20&c=KrkTdMYjObaAhhwzsTnHf8dIDpdmc5pvAujfCl6riXU=)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
                        <div className='absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-4 text-white flex flex-col justify-end'>
                            <h2 className='mb-4'>{organization.name}</h2>
                            <p className='mb-6'>{organization.description}</p>
                            <div className='flex justify-center'>
                                <Link to={`/organizations/${organization.id}`} className='bg-orange-400 text-white inline-block rounded-3xl py-2 text-center mt-2 px-4'>Organization details</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default OrganizationsPage