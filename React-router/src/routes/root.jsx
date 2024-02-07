// Import necessary React and react-router-dom modules
import { useEffect } from "react";
import {
    Outlet,
    NavLink,
    useLoaderData,
    Form,
    redirect,
    useNavigation,
    useSubmit,
} from "react-router-dom";

// Import functions for fetching contacts and creating a new contact
import { getContacts, createContact } from "../contacts"; 

// Async action function to create a new contact and redirect to its edit page
export async function action() {
    const contact = await createContact();
    return redirect(`/contacts/${contact.id}/edit`);
}

// Async loader function to fetch contacts based on the search query
export async function loader({ request }) {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    const contacts = await getContacts(q);
    return { contacts, q };
}

// Root component representing the main layout of the application
export default function Root() {
  // Retrieve data from the loader
  const { contacts, q } = useLoaderData();

  // Access navigation and submit functions from react-router-dom
  const navigation = useNavigation();
  const submit = useSubmit();

  // Check if a search is in progress
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  // Effect to set the search input value when the query changes
  useEffect(() => { 
    document.getElementById("q").value = q;
  }, [q]);

  return (
    <>
        {/* Sidebar with application header, search form, and new contact button */}
        <div id="sidebar">
            <h1>React Router Contacts</h1>

            {/* Search form */}
            <div>
                <Form id="search-form" role="search">
                    <input
                        id="q"
                        className={searching ? "loading" : ""}
                        aria-label="Search contacts"
                        placeholder="Search"
                        type="search"
                        name="q"
                        defaultValue={q}
                        onChange={(event) => {
                            const isFirstSearch = q == null;
                            submit(event.currentTarget.form, {
                                replace: !isFirstSearch,
                            });
                        }}
                    />
                    <div id="search-spinner" aria-hidden hidden={!searching} />
                    <div className="sr-only" aria-live="polite"></div>
                </Form>
                
                {/* New contact button */}
                <Form method="post">
                    <button type="submit">New</button>
                </Form>
            </div>

            {/* Navigation links for each contact */}
            <nav>
                {contacts.length ? (
                    <ul>
                        {contacts.map((contact) => (
                            <li key={contact.id}>
                                <NavLink to={`contacts/${contact.id}`} className={({ isActive, isPending }) =>
                                    isActive
                                        ? "active"
                                        : isPending
                                        ? "pending"
                                        : ""
                                    }>
                                    {contact.first || contact.last ? (
                                        <>
                                            {contact.first} {contact.last}
                                        </>
                                    ) : (
                                        <i>No Name</i>
                                    )}{" "}
                                    {contact.favorite && <span>★</span>}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>
                        <i>No contacts</i>
                    </p>
                )}
            </nav>
        </div>

        {/* Main content area with dynamic Outlet for rendering nested routes */}
        <div 
            id="detail"
            className={
              navigation.state === "loading" ? "loading" : ""
            }
        >
            <Outlet />
        </div>
    </>
  );
}
