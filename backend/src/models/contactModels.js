import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    // _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    first: String,
    last: String,
    avatar: String,
    notes: String,
    twitter: String,
    createdAt: Date,
});

export const Contact = mongoose.model("Contact", contactSchema);
