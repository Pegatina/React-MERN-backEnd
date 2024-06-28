/*
    Events routes
    /api/events
 */
const { Router } = require('express');
const { check } = require('express-validator');
const { validateJWT } = require('../middlewares/validate-jwt');
const { validateFields } = require('../middlewares/validate-fields');
const router = Router();
//Todas tienen que pasar por la validación del JWT
router.use(validateJWT);

const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { isDate } = require('../helpers/isDate');


// Obtener eventos
router.get('/', getEvents);

// Crear un nuevo evento
router.post(
    '/',
    [
        check('title', 'El título es obligatorio.').not().isEmpty(),
        check('start', 'La fecha de inicio es obligatoria.').custom(isDate),
        check('end', 'La fecha de fin es obligatoria.').custom(isDate),
        validateFields
    ],
    createEvent
);

// Actualizar evento
router.put(
    '/:id',
    [
        check('title', 'El título es obligatorio.').not().isEmpty(),
        check('start', 'La fecha de inicio es obligatoria.').custom(isDate),
        check('end', 'La fecha de fin es obligatoria.').custom(isDate),
        validateFields
    ],
    updateEvent);

// Borrar evento
router.delete('/:id',
     deleteEvent);

module.exports = router;