const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Party = require("../models/Party");
const getNextPartyID = require("../helpers/getNextPartyID");
const updateSystemState = require("../lib/systemState");

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
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [waiting, seated, cancelled]
 *         description: Filter parties by their status
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
  const { status } = req.query;
  const allowedStatuses = ["waiting", "seated", "done"];
  const filter = {};

  if (status && allowedStatuses.includes(status)) {
    filter.status = status;
  }

  try {
    const parties = await Party.find(filter);
    console.log("Found parties:", parties.length);
    res.status(200).json(parties);
  } catch (error) {
    console.error("Error fetching parties:", error);
    res.status(500).json({ error: "Failed to fetch parties" });
  }
});

/**
 * @swagger
 * /parties/{uuid}:
 *   get:
 *     summary: Get a party by UUID
 *     tags: [Parties]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID of the party to retrieve
 *     responses:
 *       200:
 *         description: Party data retrieved successfully, or null if none found
 *         content:
 *           application/json:
 *             schema:
 *               anyOf:
 *                 - $ref: '#/components/schemas/Party'
 *                 - type: 'null'
 *       500:
 *         description: Server error fetching party
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch party
 */
router.get("/:uuid", async (req, res) => {
  const { uuid } = req.params;
  try {
    const party = await Party.findOne({ uuid });

    if (!party) {
      // No party found, but this is not an error
      return res.status(200).json(null);
    }
    res.status(200).json(party);
  } catch (error) {
    console.error("Error fetching party:", error);
    res.status(500).json({ error: "Failed to fetch party" });
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
 *             type: object
 *             required:
 *               - uuid
 *               - name
 *               - size
 *             properties:
 *               uuid:
 *                 type: string
 *               name:
 *                 type: string
 *               size:
 *                 type: integer
 *               simulatedParty:
 *                 type: boolean
 *                 example: true
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
    const { uuid, name, size, simulatedParty } = req.body;

    if (!uuid || !name || typeof size !== "number") {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const partyID = await getNextPartyID(mongoose.connection.db);

    const newParty = new Party({
      uuid,
      name,
      size,
      createdAt: new Date(),
      status: "waiting", // Default status
      partyID,
      simulatedParty,
    });

    const savedParty = await newParty.save();

    // Update system state after inserting new party
    // TODO: this is the only place this is used, should it be?
    await updateSystemState();

    res.status(201).json({ message: "Party created", id: savedParty.partyID });
  } catch (error) {
    console.error("Error inserting party:", error);
    res.status(500).json({ error: "Failed to insert party" });
  }
});

/**
 * @swagger
 * /parties/{uuid}:
 *   patch:
 *     summary: Update the status of a party (e.g., waiting → seated, seated → done)
 *     tags: [Parties]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: string
 *         required: true
 *         description: UUID of the party to update
 *     requestBody:
 *       description: Status update payload
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [waiting, seated, done]
 *                 description: New status of the party
 *             required:
 *               - status
 *     responses:
 *       200:
 *         description: Party status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Party status updated to seated
 *       400:
 *         description: Invalid status or transition or not enough seats available
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Not enough seats available
 *       404:
 *         description: Party not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Party not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to update party status
 */
router.patch("/:uuid", async (req, res) => {
  const { uuid } = req.params;
  const { newStatus } = req.body;

  if (!newStatus || !["waiting", "seated", "done"].includes(newStatus)) {
    return res.status(400).json({ error: "Invalid or missing newStatus" });
  }

  try {
    // Find the party first
    const party = await Party.findOne({ uuid });

    if (!party) {
      return res.status(404).json({ error: "Party not found" });
    }

    const currentStatus = party.status;

    // Valid transitions
    // waiting -> seated - joining queue
    // seated -> done - end of service
    // waiting -> done - abandoned, or removed from queue
    if (
      !(
        (currentStatus === "waiting" && newStatus === "seated") ||
        (currentStatus === "seated" && newStatus === "done") ||
        (currentStatus === "waiting" && newStatus === "done")
      )
    ) {
      return res.status(400).json({
        error: `Invalid status transition from ${currentStatus} to ${newStatus}`,
      });
    }

    const systemColl = mongoose.connection.db.collection("system");
    const systemDoc = await systemColl.findOne({ _id: "singleton" });

    if (!systemDoc) {
      return res.status(500).json({ error: "System configuration missing" });
    }

    if (currentStatus === "waiting" && newStatus === "seated") {
      if (systemDoc.availableSeats < party.size) {
        return res.status(400).json({ error: "Not enough seats available" });
      }

      // Update party status and seatedAt
      await Party.updateOne(
        { uuid, status: currentStatus },
        { $set: { status: "seated", seatedAt: new Date() } }
      );

      // Decrement available seats in system
      await systemColl.updateOne(
        { _id: "singleton" },
        { $inc: { availableSeats: -party.size } }
      );
    } else if (currentStatus === "seated" && newStatus === "done") {
      // Update party status to done
      await Party.updateOne(
        { uuid, status: currentStatus },
        { $set: { status: "done" } }
      );

      // Increment available seats
      await systemColl.updateOne(
        { _id: "singleton" },
        { $inc: { availableSeats: party.size } }
      );
    }

    // check for nextParty
    await updateSystemState();

    return res.json({
      success: true,
      message: `Party status updated to ${newStatus}`,
    });
  } catch (err) {
    console.error("Error updating party status:", err);
    return res.status(500).json({ error: "Failed to update party status" });
  }
});

module.exports = router;
