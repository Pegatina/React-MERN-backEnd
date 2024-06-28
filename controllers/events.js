const { response } = require('express'); //Para recuperar el intellisense
const Event = require('../models/Event');

const getEvents = async (req, res = response) => {
    const events = await Event.find()
        .populate('user', 'name');

    return res.json({
        ok: true,
        events,
    })
};

const createEvent = async (req, res = response) => {
    //Verificar que tenga el evento
    // console.log(req.body);
    const event = new Event(req.body);

    try {
        event.user = req.uid;
        const eventSaved = await event.save();
        return res.status(201).json({
            ok: true,
            eventSaved
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor, hable con el administrador.'
        });
    }
};

const updateEvent = async (req, res = response) => {
    const eventId = req.params.id;
    const uid = req.uid;

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ningún evento con ese id.'
            })
        }
        if (event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene permisos para editar este evento.'
            })
        }
        const newEvent = {
            ...req.body,
            user: uid
        }
        const updatedEvent = await Event.findByIdAndUpdate(eventId, newEvent, { new: true });
        return res.json({
            ok: true,
            event: updatedEvent
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor, hable con el administrador.'
        });
    }
};

const deleteEvent = async (req, res = response) => {
    const eventId = req.params.id;
    const uid = req.uid;

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ningún evento con ese id.'
            })
        }
        if (event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene permisos para borrar este evento.'
            })
        }
        await Event.findByIdAndDelete(eventId);
        return res.json({
            ok: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor, hable con el administrador.'
        });
    }
};
module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
};