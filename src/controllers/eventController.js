const { Event, EventFaq, EventRegister, User } = require("../models");
const { uploadToCloudinary } = require("../utils/cloudinary");
const { Op } = require("sequelize");

// Get all events
const getAllEvents = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    const whereClause = {};
    if (search) {
      whereClause.title = { [Op.like]: `%${search}%` };
    }

    // If status is provided and not empty, filter by it.
    // If empty/undefined, return all (as requested).
    if (status) {
      whereClause.status = status;
    }

    const { count, rows } = await Event.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: EventFaq,
          as: "faqs",
        },
      ],
      limit: limitNum,
      offset: offset,
      order: [["start_date", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(count / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get event by ID
const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id, {
      include: [
        {
          model: EventFaq,
          as: "faqs",
        },
      ],
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// Create event
const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      content,
      duration,
      location,
      tag,
      start_date,
      end_date,
      status,
    } = req.body;

    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required" });
    }

    if (!start_date) {
      return res
        .status(400)
        .json({ success: false, message: "Start date is required" });
    }

    let thumbnail_url = null;
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file);
      thumbnail_url = uploadResult.secure_url;
    }

    const event = await Event.create({
      title,
      content,
      duration,
      location,
      tag,
      thumbnail_url,
      thumbnail_url,
      start_date,
      end_date,
      status: status || "Draft",
    });

    // Handle FAQs
    if (req.body.faqs) {
      let faqs = req.body.faqs;

      await Promise.all(
        faqs.map((faq) =>
          EventFaq.create({
            event_id: event.id,
            question: faq.question,
            answer: faq.answer,
          })
        )
      );
    }

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// Update event
const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      duration,
      location,
      tag,
      start_date,
      end_date,
      status,
    } = req.body;

    const event = await Event.findByPk(id);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    if (title) event.title = title;
    if (content) event.content = content;
    if (duration) event.duration = duration;
    if (location) event.location = location;
    if (tag) event.tag = tag;
    if (start_date) event.start_date = start_date;
    if (end_date) event.end_date = end_date;
    if (status) event.status = status;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file);
      event.thumbnail_url = uploadResult.secure_url;
    }

    await event.save();

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// Delete event
const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    //Soft Delete
    event.status = "Deleted";
    await event.save();

    res.status(200).json({
      success: true,
      message: "Event deleted",
    });
  } catch (error) {
    next(error);
  }
};

// Add FAQ to Event
const addEventFaq = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res
        .status(400)
        .json({ success: false, message: "Question and answer are required" });
    }

    const faq = await EventFaq.create({
      event_id: eventId,
      question,
      answer,
    });

    res.status(201).json({ success: true, data: faq });
  } catch (error) {
    next(error);
  }
};

// Delete FAQ
const deleteEventFaq = async (req, res, next) => {
  try {
    const { faqId } = req.params;

    const faq = await EventFaq.findByPk(faqId);
    if (!faq) {
      return res.status(404).json({ success: false, message: "FAQ not found" });
    }

    await faq.destroy();

    res.status(200).json({
      success: true,
      message: "FAQ deleted",
    });
  } catch (error) {
    next(error);
  }
};

// Register for Event
const registerForEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    // Check if already registered
    const existing = await EventRegister.findOne({
      where: {
        event_id: eventId,
        user_id: userId,
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "User already registered for this event",
      });
    }

    let image_url = null;
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file);
      image_url = uploadResult.secure_url;
    }

    const register = await EventRegister.create({
      event_id: eventId,
      user_id: userId,
      image_url,
    });

    res.status(201).json({ success: true, data: register });
  } catch (error) {
    next(error);
  }
};

// Get Registers for an Event
const getEventRegisters = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const registers = await EventRegister.findAll({
      where: { event_id: eventId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    res.status(200).json({ success: true, data: registers });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  addEventFaq,
  registerForEvent,
  getEventRegisters,
};
