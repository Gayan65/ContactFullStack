import express from "express";
import { Contact } from "../models/contactModels.js";
import bodyParser from "body-parser";

const contact_router = express();
contact_router.use(bodyParser.urlencoded({ extended: false }));

//Get all contacts
contact_router.get("/contact/all", async (req, res) => {
    try {
        await Contact.find().then((contacts) => {
            if (contacts.length <= 0) {
                res.status(200).json({
                    success: false,
                    message: "No contact to display !",
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: "contacts found successfully !",
                    contacts: contacts,
                });
            }
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

//Creating a Contact
contact_router.post("/contact/create", async (req, res) => {
    const { first, last, avatar, notes, twitter, id, createdAt } = req.body;

    const contact = new Contact({
        first: first,
        last: last,
        avatar: avatar,
        notes: notes,
        twitter: twitter,
        createdAt: createdAt,
    });

    try {
        await contact.save().then((contact) => {
            return res.status(200).json({
                success: true,
                message: "Contact saved successfully !",
                contact: contact,
            });
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

//Get a Contact from id
contact_router.get("/contact/find/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await Contact.find({ _id: id }).then((contact) => {
            if (contact.length <= 0) {
                return res.status(200).json({
                    success: false,
                    message: "Contact not found !",
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: "Contact found successfully !",
                    contact: contact,
                });
            }
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

//Update a contact
contact_router.patch("/contact/edit/:id", async (req, res) => {
    const id = req.params.id;
    //const { first, last, avatar, notes, twitter, createdAt } = req.body;
    try {
        await Contact.findOne({ _id: id }).then(async (contact) => {
            if (contact) {
                await Contact.findByIdAndUpdate(
                    id,
                    { $set: req.body },
                    { new: true }
                ).then((updatedContact) => {
                    res.status(200).json({
                        success: true,
                        message: "Contact updated successfully !",
                        new_contact: updatedContact,
                        pre_contact: contact,
                    });
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Contact can not be found",
                });
            }
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

export default contact_router;
