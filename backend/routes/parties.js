const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Party = require("../models/Party");
const getNextPartyID = require("../helpers/getNextPartyID");
/**
 * @swagger
 * tags:
 *   name: Parties
 *   description: Party management endpoints
 */

/**
 * @swagger
 * /parties:
 *   get:
 *     summary: Get all parties
 *     tags: [Parties]
 *     responses:
 *       200:
 *         description: A list of parties
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Party'
 */
router.get("/", async (req, res) => {
  try {
    const parties = await Party.find();
    res.status(200).json(parties);
  } catch (error) {
    console.error("Error fetching parties:", error);
    res.status(500).json({ error: "Failed to fetch parties" });
  }
});

/**
 * @swagger
 * /parties:
 *   post:
 *     summary: Create a new party
 *     tags: [Parties]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Party'
 *     responses:
 *       201:
 *         description: Party created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Party created
 *                 id:
 *                   type: string
 *       400:
 *         description: Bad request - missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Missing required fields
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to insert party
 */
router.post("/", async (req, res) => {
  try {
    const { uuid, name, size } = req.body;

    if (!uuid || !name || typeof size !== "number") {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const partyID = await getNextPartyID(mongoose.connection.db);

    const newParty = new Party({
      uuid,
      name,
      size,
      createdAt: new Date(),
      partyID,
    });

    const savedParty = await newParty.save();
    res.status(201).json({ message: "Party created", id: savedParty.partyID });
  } catch (error) {
    console.error("Error inserting party:", error);
    res.status(500).json({ error: "Failed to insert party" });
  }
});

module.exports = router;
