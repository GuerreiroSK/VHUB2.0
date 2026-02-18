import Event from '../entities/Event.js'

export async function getEventData() {
    
    const event = new Event(
        1, 
        "Help Alcacer",
        "Alcacer do Sal", 
        1, 
        "alcacer@help.com"
    );

    return event;
}