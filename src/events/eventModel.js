import mongoose from "mongoose";
const eventSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    eventDate: Date,
    venue: String,
    capacity: number,
    category: {
      type: String,
      enum: ["workshop", "training", "event", "bootcamp", "seminar"],
    },
    image: String,
  },
  { timestamps: true }
);

export const EventModel = mongoose.model("Event", eventSchema);
