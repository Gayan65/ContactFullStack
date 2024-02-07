import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";
import axios from "axios";
import qs from "qs";

//THIS CALLS EVERY TIME TO MAP THE CONTACTS
export async function getContacts(query) {
    console.log("getContacts");
    await fakeNetwork(`getContacts:${query}`);
    //let contacts = await localforage.getItem("contacts");
    let contacts = await axios("http://localhost:4000/contact/all").then(
        (response) => {
            return response.data.contacts;
        }
    );
    if (!contacts) contacts = [];
    if (query) {
        contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
    }
    return contacts.sort(sortBy("last", "createdAt"));
}

export async function createContact() {
    console.log("createContact");
    //await fakeNetwork();
    //let id = Math.random().toString(36).substring(2, 9);
    //let contact = { id, createdAt: Date.now() };
    //let contacts = await getContacts();
    //contacts.unshift(contact);
    //await set(contacts);
    let contactDate = { createdAt: Date.now() };
    const data = qs.stringify(contactDate);
    let contact = await axios
        .post("http://localhost:4000/contact/create", data)
        .then((response) => {
            return response.data.contact;
        });
    console.log("from create contact", contact);
    return contact;
}

export async function getContact(id) {
    console.log("getContact", id);
    await fakeNetwork(`contact:${id}`);
    //let contacts = await localforage.getItem("contacts");
    //let contact = contacts.find((contact) => contact.id === id);
    let contact = await axios
        .get(`http://localhost:4000/contact/find/${id}`)
        .then((response) => {
            return response.data.contact[0];
        });
    return contact ?? null;
}

export async function updateContact(id, updates) {
    console.log("updateContact, id, updates", id, updates);
    await fakeNetwork();
    //let contacts = await localforage.getItem("contacts");
    //let contact = contacts.find((contact) => contact.id === id);
    //if (!contact) throw new Error("No contact found for", id);
    //Object.assign(contact, updates);
    //await set(contacts);
    const data = qs.stringify(updates);
    const contact = await axios.patch(
        `http://localhost:4000/contact/edit/${id}`,
        data
    );
    return contact;
}

export async function deleteContact(id) {
    console.log("deleteContact");
    let contacts = await localforage.getItem("contacts");
    let index = contacts.findIndex((contact) => contact.id === id);
    if (index > -1) {
        contacts.splice(index, 1);
        await set(contacts);
        return true;
    }
    return false;
}

function set(contacts) {
    console.log("set");
    return localforage.setItem("contacts", contacts);
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache = {};

async function fakeNetwork(key) {
    if (!key) {
        fakeCache = {};
    }

    if (fakeCache[key]) {
        return;
    }

    fakeCache[key] = true;
    return new Promise((res) => {
        setTimeout(res, Math.random() * 800);
    });
}
