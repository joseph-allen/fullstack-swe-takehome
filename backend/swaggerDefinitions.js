module.exports = {
  components: {
    schemas: {
      Party: {
        type: "object",
        properties: {
          uuid: {
            type: "string",
            description: "Unique identifier for the party",
            example: "uuid-1",
          },
          partyID: {
            type: "string",
            description: "Secondary party identifier",
            example: "001",
          },
          name: {
            type: "string",
            description: "Name of the party",
            example: "Alice",
          },
          size: {
            type: "integer",
            description: "Number of people in the party",
            example: 2,
          },
          status: {
            type: "string",
            description: "Current status of the party",
            enum: ["waiting", "seated", "done"],
            example: "waiting",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Timestamp when the party was created",
            example: "2025-05-26T13:14:00.403Z",
          },
          seatedAt: {
            type: "string",
            format: "date-time",
            description: "Timestamp when the party was seated",
            nullable: true,
            example: "2025-05-26T13:30:00.000Z",
          },
        },
        required: ["uuid", "partyID", "name", "size", "status", "createdAt"],
        additionalProperties: false,
      },
    },
  },
};
