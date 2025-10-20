import { Router } from 'express';
import { restrictUserLogin } from "../middlewares/auth.middlewares.js";
import { createReport } from '../controllers/report.controllers.js';
const router = Router();


router.post('/', restrictUserLogin, upload.single('img'),createReport);
router.get('/getAll', restrictUserLogin,getAllReports );
router.get('/get/:id', getReportByUserId);
router.get('/getreport/:id', getReportById);
router.post('/change/:incidentId',verifyIncidentStatus);
router.delete('/:id', deleteIncident);

export default router;