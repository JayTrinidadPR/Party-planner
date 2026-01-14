/**
 * @typedef {Object} Event
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {string} date
 * @property {string} location
 */

// === Constants ===
const BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const COHORT = "/2511-FTB-CT-WEB-PT"; 
const RESOURCE = "/events";
const API = BASE + COHORT + RESOURCE;

// === State ===
let events = [];
let selectedEvent;

// Small helper: rerender after state changes
function rerender() {
  render();
}

/** Updates state with all events from the API */
async function getEvents() {
  try {
    const response = await fetch(API);
    const result = await response.json();

    // API shape is usually: { data: [...] }
    events = result.data;

    rerender();
  } catch (err) {
    console.error("getEvent error:", err);
  }
}

//////////


/** Updates state with a single event from the API */
async function getEvent(id) {
  try {
    const response = await fetch(`${API}/${id}`);
    const result = await response.json();

    // API shape is usually: { data: { ... } }
    selectedEvent = result.data;

    rerender();
  } catch (err) {
    console.error("getEvent error:", err);
  }
}

// === Components ===

/** Event name that shows more details about the events when clicked */

  function EventListItem(evt){
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#selected";
    a.textContent = evt.name;

  a.addEventListener("click", (e) => {
    e.preventDefault();
    getEvent(evt.id)
  });

  li.appendChild(a);
  return li;
}

/** A list of names of all events */
function EventList() {

  const ul = document.createElement("ul");
  ul.className = "lineup";

  events.forEach((event) => {
    ul.appendChild(EventListItem(event));
  });

  return ul;
}

/** Detailed information about the selected events */
function EventDetails() {
  if (!selectedEvent) {
    const p = document.createElement("p");
    p.textContent = "Please select an event to learn more.";
    return p;
  }


  const section = document.createElement("section");
  section.className = "event";

  const h3 = document.createElement("h3");
  h3.textContent = `${selectedEvent.name} #${selectedEvent.id}`;

  const figure = document.createElement("figure");

  const p = document.createElement("p");
  p.textContent = selectedEvent.description;

  section.append(h3, p);
  return section;
}

// === Render ===
function render() {
  const app = document.querySelector("#app");

  // Keep your “placeholder tags” so we can replace them
  app.innerHTML = `
    <h1>Event Planner</h1>
    <main>
      <section>
        <h2>Upcoming Events</h2>
        <EventList></EventList>
      </section>
      <section id="selected">
        <h2>Event Details</h2>
        <EventDetails></EventDetails>
      </section>
    </main>
  `;

  app.querySelector("EventList").replaceWith(EventList());
  app.querySelector("EventDetails").replaceWith(EventDetails());
}

async function init() {
  // getEvents already rerenders after it updates state
  await getEvents();
}

init();