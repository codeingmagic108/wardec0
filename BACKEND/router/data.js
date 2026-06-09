import express from 'express';
import Data from '../models/data.js';

const router = express.Router();

router.get('/all', async (req, res) => {
  try {
    const data = await Data.findAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/data/:id', async (req, res) => {
  try {
    const data = await Data.findByPk(req.params.id);
    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedRows = await Data.destroy({ where: { id: req.params.id } });
    if (!deletedRows) {
      return res.status(404).json({ message: 'Data not found' });
    }
    res.json({ message: 'Record deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/create', async (req, res) => {
  try {
    const savedData = await Data.create({
      rollno: req.body.rollno,
      name: req.body.name,
      mobile: req.body.mobile,
      city: req.body.city,
      marks: req.body.marks,
    });
    res.status(201).json(savedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const [updatedCount] = await Data.update(req.body, {
      where: { id: req.params.id },
      returning: true,
    });
    if (!updatedCount) {
      return res.status(404).json({ message: 'Data not found' });
    }
    const updatedData = await Data.findByPk(req.params.id);
    res.json(updatedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;