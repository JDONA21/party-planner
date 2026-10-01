/**
 * @typedef Events
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {string} date
 * @property {string} location
 */
// === Constants ===
const BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const COHORT = "/2608"; // Make sure to change this!
const RESOURCE = "/events";
const API = BASE + COHORT + RESOURCE;

//  === State ===
let events = [];
let selectedEvent;
let rsvps = [];
let guests = [];

async function getEvents() {
  try {
    const response = await fetch(API);
    const result = await response.json();
    events = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}

async function getEvent(id) {
  try {
    const response = await fetch(API + "/" + id);
    const result = await response.json();
    selectedEvent = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}
async function getRsvps() {
  try {
    const response = await fetch(API);
    const result = await response.json();
    rsvps = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}

async function getGuests() {
  try {
    const response = await fetch(API);
    const result = await response.json();
    guests = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}
// === Components ===

/** Event names but when clicked details are shown */
function EventListItem(event) {
  const $li = document.createElement("li");
  $li.innerHTML = `
    <a href="#selected">${event.name}</a>
  `;
  $li.addEventListener("click", () => getEvent(event.id));
  return $li;
}

/** A list of names of the Events */
function EventList() {
  const $ul = document.createElement("ul");
  $ul.classList.add("upcoming", "parties");

  const $events = events.map(EventListItem);
  $ul.replaceChildren(...$events);

  return $ul;
}
/** Detailed information about the upcoming event */
function EventDetails() {
  if (!selectedEvent) {
    const $p = document.createElement("p");
    $p.textContent = "Select party for details";
    return $p;
  }

  const $event = document.createElement("section");
  $event.classList.add("event");
  $event.innerHTML = `
 <h3>${selectedEvent.name} #${selectedEvent.id}</h3>
  <time datetime="${selectedEvent.date}">
   ${selectedEvent.date.slice(0, 10)}
     </time>
      <address>${selectedEvent.location}</address>
     <p>${selectedEvent.description}</p>
     <GuestList></GuestList>
`;

  return $event;
}
function GuestList() {
  const $ul = document.createElement("ul");
  const guestsAtParty = guests.filter((guest) =>
    rsvps.find(
      (rsvp) => rsvp.guestId === guest.id && rsvp.eventId === selectedParty.id,
    ),
  );

  // Simple components can also be created anonymously:
  const $guests = guestsAtParty.map((guest) => {
    const $guest = document.createElement("li");
    $guest.textContent = guest.name;
    return $guest;
  });
  $ul.replaceChildren(...$guests);

  return $ul;
}

function render() {
  const $app = document.querySelector("#app");
  $app.innerHTML = `
    <h1>Party Planner</h1>
    <main>
      <section>
        <h2>Upcoming Parties</h2>
        <EventList></EventList>
      </section>
      <section id="selected">
        <h2>Party Details</h2>
        <EventDetails></EventDetails>
      </section>
    </main>
  `;
  $app.querySelector("EventList").replaceWith(EventList());
  $app.querySelector("EventDetails").replaceWith(EventDetails());
}

async function init() {
  await getEvents();
  await getRsvps();
  await getGuests();
  render();
}

init();
