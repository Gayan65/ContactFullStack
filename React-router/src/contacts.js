import { matchSorter } from "match-sorter";
import sortBy from "sort-by";
import axios from "axios";
import qs from "qs";

//THIS CALLS EVERY TIME TO MAP THE CONTACTS
export async function getContacts(query) {
    await fakeNetwork(`getContacts:${query}`);
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
    await fakeNetwork();
    let contactDate = { createdAt: Date.now() };
    const data = qs.stringify(contactDate);

    let contact = await axios
        .post("http://localhost:4000/contact/create", data)
        .then((response) => {
            var person = {
                id: response.data.contact._id,
            };
            return person;
        });
    return contact;
}

export async function getContact(id) {
    await fakeNetwork(`contact:${id}`);
    let contact = await axios
        .get(`http://localhost:4000/contact/find/${id}`)
        .then((response) => {
            return response.data.contact[0];
        });
    return contact ?? null;
}

export async function updateContact(id, updates) {
    await fakeNetwork();
    const data = qs.stringify(updates);
    const contact = await axios.patch(
        `http://localhost:4000/contact/edit/${id}`,
        data
    );
    return contact;
}

export async function deleteContact(id) {
    await axios.delete(`http://localhost:4000/contact/delete/${id}`);
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
