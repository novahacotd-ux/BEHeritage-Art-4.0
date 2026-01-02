const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const authenticate = require("../middleware/authenticate"); // Assuming generic auth middleware
const authorize = require("../middleware/authorize");
const upload = require("../middleware/upload");
const validate = require("../middleware/validate");
const {
  createEventValidation,
  updateEventValidation,
  addEventFaqValidation,
} = require("../utils/validators");

// Public routes (if any - maybe getAllEvents?)
// Assuming events are public:
router.get("/", eventController.getAllEvents);
router.get("/:id", eventController.getEventById);

// Protected routes
router.use(authenticate);

// Events
router.post(
  "/",
  authorize("ADMIN"),
  upload.single("thumbnailUrl"),
  createEventValidation,
  validate,
  eventController.createEvent
);
router.put(
  "/:id",
  authorize("ADMIN"),
  upload.single("thumbnailUrl"),
  updateEventValidation,
  validate,
  eventController.updateEvent
);
router.delete("/:id", authorize("ADMIN"), eventController.deleteEvent);

// FAQs
router.post(
  "/:eventId/faqs",
  authorize("ADMIN"),
  addEventFaqValidation,
  validate,
  eventController.addEventFaq
);

// Delete FAQ
// router.delete(
//   "/faqs/:faqId",
//   authorize("ADMIN"),
//   eventController.deleteEventFaq
// );

// Registers
router.post(
  "/:eventId/register",
  upload.single("imageUrl"),
  eventController.registerForEvent
);

// Get registers
router.get(
  "/:eventId/registers",
  authorize("ADMIN"),
  eventController.getEventRegisters
);

module.exports = router;
