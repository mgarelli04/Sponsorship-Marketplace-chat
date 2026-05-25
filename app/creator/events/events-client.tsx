"use client";

import {
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  Clock,
  MapPin,
  Pencil,
  RotateCcw,
  Save,
  Trash2,
  Ticket,
  X,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { CreatorEventView } from "@/src/creator/events";

type CategoryOption = {
  id: string;
  name: string;
};

type CreatorDefaults = {
  displayName: string;
  profileStatus: string;
  countryCode: string;
  region: string;
  city: string;
  addressLine: string | null;
  latitude: string;
  longitude: string;
};

type EventFormState = {
  id: string | null;
  title: string;
  description: string;
  eventFormat: "in_person" | "hybrid" | "online";
  categoryId: string;
  startsAt: string;
  endsAt: string;
  timezone: string;
  venueName: string;
  countryCode: string;
  region: string;
  city: string;
  addressLine: string;
  latitude: string;
  longitude: string;
  ticketsSold: string;
  checkinsCount: string;
  eventStatus: "upcoming" | "past" | "cancelled" | "draft";
};

const statusConfig: Record<CreatorEventView["eventStatus"], { label: string; className: string }> = {
  upcoming: { label: "Upcoming", className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  past: { label: "Past", className: "border-slate-200 bg-slate-50 text-slate-600" },
  cancelled: { label: "Cancelled", className: "border-red-200 bg-red-50 text-red-700" },
  draft: { label: "Draft", className: "border-amber-200 bg-amber-50 text-amber-700" },
};

const formatConfig: Record<CreatorEventView["eventFormat"], string> = {
  in_person: "In person",
  hybrid: "Hybrid",
  online: "Online",
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function toDatetimeLocal(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function defaultStart() {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  date.setHours(18, 0, 0, 0);
  return toDatetimeLocal(date.toISOString());
}

function defaultEnd(start: string) {
  const date = new Date(start);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  date.setHours(date.getHours() + 3);
  return toDatetimeLocal(date.toISOString());
}

function buildEmptyForm(creator: CreatorDefaults): EventFormState {
  const startsAt = defaultStart();

  return {
    id: null,
    title: "",
    description: "",
    eventFormat: "in_person",
    categoryId: "",
    startsAt,
    endsAt: defaultEnd(startsAt),
    timezone: "Europe/Madrid",
    venueName: "",
    countryCode: creator.countryCode || "ES",
    region: creator.region || "",
    city: creator.city || "",
    addressLine: creator.addressLine || "",
    latitude: creator.latitude || "40.4168000",
    longitude: creator.longitude || "-3.7038000",
    ticketsSold: "0",
    checkinsCount: "0",
    eventStatus: "upcoming",
  };
}

function formFromEvent(event: CreatorEventView): EventFormState {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    eventFormat: event.eventFormat,
    categoryId: event.categoryId ?? "",
    startsAt: toDatetimeLocal(event.startsAt),
    endsAt: toDatetimeLocal(event.endsAt),
    timezone: event.timezone,
    venueName: event.venueName,
    countryCode: event.countryCode,
    region: event.region,
    city: event.city,
    addressLine: event.addressLine,
    latitude: event.latitude,
    longitude: event.longitude,
    ticketsSold: String(event.ticketsSold),
    checkinsCount: String(event.checkinsCount),
    eventStatus: event.eventStatus,
  };
}

function normalizeApiEvent(row: CreatorEventView, categories: CategoryOption[]): CreatorEventView {
  return {
    ...row,
    categoryName:
      row.categoryName ??
      categories.find((category) => category.id === row.categoryId)?.name ??
      null,
    latitude: String(row.latitude),
    longitude: String(row.longitude),
    startsAt: new Date(row.startsAt).toISOString(),
    endsAt: new Date(row.endsAt).toISOString(),
    updatedAt: new Date(row.updatedAt).toISOString(),
  };
}

export default function CreatorEventsClient({
  initialEvents,
  categories,
  creator,
}: {
  initialEvents: CreatorEventView[];
  categories: CategoryOption[];
  creator: CreatorDefaults;
}) {
  const [events, setEvents] = useState(initialEvents);
  const [form, setForm] = useState<EventFormState>(() => buildEmptyForm(creator));
  const [submitting, setSubmitting] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<CreatorEventView | null>(null);
  const [profileStatus, setProfileStatus] = useState(creator.profileStatus);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const formPanelRef = useRef<HTMLElement | null>(null);
  const titleInputRef = useRef<HTMLInputElement | null>(null);

  const selectedEvent = useMemo(
    () => events.find((event) => event.id === form.id) ?? null,
    [events, form.id],
  );
  const upcomingCount = events.filter((event) => event.eventStatus === "upcoming").length;
  const totalTickets = events.reduce((total, event) => total + event.ticketsSold, 0);
  const totalCheckins = events.reduce((total, event) => total + event.checkinsCount, 0);

  const updateField = (key: keyof EventFormState, value: string) => {
    setForm((current) => {
      if (key === "startsAt" && current.endsAt === defaultEnd(current.startsAt)) {
        return { ...current, startsAt: value, endsAt: defaultEnd(String(value)) };
      }

      return { ...current, [key]: value };
    });
  };

  const startNewEvent = () => {
    setForm(buildEmptyForm(creator));
    setError(null);
    setNotice("Ready to create a new event.");

    requestAnimationFrame(() => {
      formPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      titleInputRef.current?.focus();
    });
  };

  const resetForm = () => {
    setForm(buildEmptyForm(creator));
    setError(null);
    setNotice(null);
  };

  const editEvent = (event: CreatorEventView) => {
    setForm(formFromEvent(event));
    setError(null);
    setNotice(null);
  };

  const openDeleteConfirmation = (event: CreatorEventView) => {
    setEventToDelete(event);
    setError(null);
    setNotice(null);
  };

  const deleteEvent = async () => {
    if (!eventToDelete) {
      return;
    }

    setDeleting(true);
    setError(null);
    setNotice(null);

    try {
      const response = await fetch(`/api/creator/events/${eventToDelete.id}`, {
        method: "DELETE",
      });
      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.error || "Could not delete event");
      }

      setEvents((current) => current.filter((event) => event.id !== eventToDelete.id));
      if (form.id === eventToDelete.id) {
        setForm(buildEmptyForm(creator));
      }
      setEventToDelete(null);
      setNotice("Event deleted.");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete event");
    } finally {
      setDeleting(false);
    }
  };

  const publishProfile = async () => {
    setPublishing(true);
    setError(null);
    setNotice(null);

    try {
      const response = await fetch("/api/creator/profile/publish", {
        method: "POST",
      });
      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.error || "Could not publish profile");
      }

      setProfileStatus("published");
      setNotice("Profile published. Refresh Sponsor Discover and search again.");
    } catch (publishError) {
      setError(publishError instanceof Error ? publishError.message : "Could not publish profile");
    } finally {
      setPublishing(false);
    }
  };

  const submitEvent = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setNotice(null);

    const payload = {
      title: form.title,
      description: form.description,
      eventFormat: form.eventFormat,
      categoryId: form.categoryId || null,
      startsAt: form.startsAt,
      endsAt: form.endsAt,
      timezone: form.timezone,
      venueName: form.venueName,
      countryCode: form.countryCode,
      region: form.region,
      city: form.city,
      addressLine: form.addressLine,
      latitude: form.latitude,
      longitude: form.longitude,
      ticketsSold: Number(form.ticketsSold),
      checkinsCount: Number(form.checkinsCount),
      eventStatus: form.eventStatus,
    };

    try {
      const response = await fetch(form.id ? `/api/creator/events/${form.id}` : "/api/creator/events", {
        method: form.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await response.json();

      if (!response.ok) {
        const details = Array.isArray(body.details) ? `: ${body.details.join(", ")}` : "";
        throw new Error(`${body.error || "Could not save event"}${details}`);
      }

      const saved = normalizeApiEvent(body.event, categories);
      setEvents((current) => {
        const exists = current.some((item) => item.id === saved.id);
        const next = exists
          ? current.map((item) => (item.id === saved.id ? saved : item))
          : [saved, ...current];

        return [...next].sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime());
      });
      setNotice(form.id ? "Event updated." : "Event created.");
      setForm(buildEmptyForm(creator));
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save event");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f6f8]">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#f79009]">
              Creator events
            </p>
            <h1 className="text-4xl font-bold text-[#0f1c3f]">{creator.displayName}</h1>
            <p className="mt-2 max-w-3xl text-base text-[#6b7e9e]">
              Manage the events that power your media kit, sponsor profile, and discovery metrics.
            </p>
          </div>
          <button
            type="button"
            onClick={startNewEvent}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#f79009] px-4 text-sm font-semibold text-white transition hover:bg-[#e88507]"
          >
            <CalendarPlus className="h-4 w-4" />
            New event
          </button>
        </div>

        {profileStatus !== "published" ? (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold">This creator profile is {profileStatus}.</p>
                <p className="mt-1">
                  Sponsors only see published creator profiles in Discover. Publish the profile after reviewing the events you want sponsors to find.
                </p>
              </div>
              <button
                type="button"
                onClick={publishProfile}
                disabled={publishing}
                className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-[#f79009] px-4 text-sm font-semibold text-white transition hover:bg-[#e88507] disabled:opacity-60"
              >
                {publishing ? "Publishing..." : "Publish profile"}
              </button>
            </div>
          </div>
        ) : null}

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <Metric icon={<CalendarDays className="h-4 w-4" />} label="Events" value={events.length.toString()} />
          <Metric icon={<Clock className="h-4 w-4" />} label="Upcoming" value={upcomingCount.toString()} />
          <Metric icon={<Ticket className="h-4 w-4" />} label="Tickets / check-ins" value={`${totalTickets} / ${totalCheckins}`} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
          <section>
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-[#0f1c3f]">All events</h2>
              <span className="text-sm text-[#6b7e9e]">{events.length} total</span>
            </div>

            <div className="space-y-4">
              {events.length > 0 ? (
                events.map((event) => {
                  const status = statusConfig[event.eventStatus];
                  const isSelected = selectedEvent?.id === event.id;

                  return (
                    <article
                      key={event.id}
                      className={`rounded-lg border bg-white p-5 transition ${
                        isSelected
                          ? "border-[#f79009] shadow-[0_8px_22px_rgba(247,144,9,0.14)]"
                          : "border-[#d9e0eb] hover:shadow-[0_4px_12px_rgba(18,34,72,0.06)]"
                      }`}
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="min-w-0">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${status.className}`}>
                              {status.label}
                            </span>
                            <span className="rounded-full border border-[#d9e0eb] px-3 py-1 text-xs font-semibold text-[#0f1c3f]">
                              {formatConfig[event.eventFormat]}
                            </span>
                            {event.categoryName ? (
                              <span className="rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-semibold text-[#0a66c2]">
                                {event.categoryName}
                              </span>
                            ) : null}
                          </div>
                          <h3 className="text-xl font-bold text-[#0f1c3f]">{event.title}</h3>
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#5f7190]">
                            {event.description}
                          </p>
                          <div className="mt-4 grid gap-2 text-sm text-[#66758f] sm:grid-cols-2">
                            <span className="inline-flex items-center gap-2">
                              <Clock className="h-4 w-4 text-[#f79009]" />
                              {dateFormatter.format(new Date(event.startsAt))}
                            </span>
                            <span className="inline-flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-[#f79009]" />
                              {[event.venueName, event.city].filter(Boolean).join(", ")}
                            </span>
                            <span className="inline-flex items-center gap-2">
                              <Ticket className="h-4 w-4 text-[#f79009]" />
                              {event.ticketsSold.toLocaleString()} tickets
                            </span>
                            <span className="inline-flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              {event.checkinsCount.toLocaleString()} check-ins
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => editEvent(event)}
                          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#d9e0eb] bg-white px-4 text-sm font-semibold text-[#0f1c3f] transition hover:border-[#f79009] hover:text-[#f79009]"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </button>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="rounded-lg border border-dashed border-[#cfd8e6] bg-white p-8">
                  <h3 className="font-semibold text-[#0f1c3f]">No events yet</h3>
                  <p className="mt-2 text-sm text-[#6b7e9e]">
                    Create the first event to make your creator profile richer for sponsors.
                  </p>
                </div>
              )}
            </div>
          </section>

          <aside
            ref={formPanelRef}
            className="rounded-lg border border-[#d9e0eb] bg-white p-5 shadow-[0_8px_22px_rgba(18,34,72,0.06)]"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#0f1c3f]">
                  {form.id ? "Edit event" : "Create event"}
                </h2>
                <p className="mt-1 text-sm text-[#6b7e9e]">
                  {form.id ? "Changes update the sponsor-facing profile." : "Manual events start as unverified."}
                </p>
              </div>
              {form.id ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg p-2 text-[#66758f] transition hover:bg-[#f3f5f9] hover:text-[#0f1c3f]"
                  aria-label="Cancel editing"
                >
                  <X className="h-5 w-5" />
                </button>
              ) : null}
            </div>

            {error ? (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}
            {notice ? (
              <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                {notice}
              </div>
            ) : null}

            <form onSubmit={submitEvent} className="space-y-4">
              <TextInput
                ref={titleInputRef}
                label="Title"
                value={form.title}
                onChange={(value) => updateField("title", value)}
                required
              />
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-[#0f1c3f]">Description</span>
                <textarea
                  value={form.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  rows={4}
                  required
                  className="w-full resize-none rounded-lg border border-[#d9e0eb] px-3 py-2 text-sm text-[#0f1c3f] outline-none transition focus:border-[#f79009]"
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <SelectInput
                  label="Format"
                  value={form.eventFormat}
                  onChange={(value) => updateField("eventFormat", value as EventFormState["eventFormat"])}
                  options={[
                    ["in_person", "In person"],
                    ["hybrid", "Hybrid"],
                    ["online", "Online"],
                  ]}
                />
                <SelectInput
                  label="Status"
                  value={form.eventStatus}
                  onChange={(value) => updateField("eventStatus", value as EventFormState["eventStatus"])}
                  options={[
                    ["upcoming", "Upcoming"],
                    ["past", "Past"],
                    ["draft", "Draft"],
                    ["cancelled", "Cancelled"],
                  ]}
                />
              </div>

              <SelectInput
                label="Category"
                value={form.categoryId}
                onChange={(value) => updateField("categoryId", value)}
                options={[["", "No category"], ...categories.map((category) => [category.id, category.name] as [string, string])]}
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <DateInput label="Starts" value={form.startsAt} onChange={(value) => updateField("startsAt", value)} />
                <DateInput label="Ends" value={form.endsAt} onChange={(value) => updateField("endsAt", value)} />
              </div>

              <TextInput label="Timezone" value={form.timezone} onChange={(value) => updateField("timezone", value)} required />
              <TextInput label="Venue" value={form.venueName} onChange={(value) => updateField("venueName", value)} required />

              <div className="grid gap-3 sm:grid-cols-3">
                <TextInput label="Country" value={form.countryCode} onChange={(value) => updateField("countryCode", value)} required />
                <TextInput label="Region" value={form.region} onChange={(value) => updateField("region", value)} required />
                <TextInput label="City" value={form.city} onChange={(value) => updateField("city", value)} required />
              </div>

              <TextInput label="Address" value={form.addressLine} onChange={(value) => updateField("addressLine", value)} required />

              <div className="grid gap-3 sm:grid-cols-2">
                <TextInput label="Latitude" value={form.latitude} onChange={(value) => updateField("latitude", value)} required />
                <TextInput label="Longitude" value={form.longitude} onChange={(value) => updateField("longitude", value)} required />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <NumberInput label="Tickets sold" value={form.ticketsSold} onChange={(value) => updateField("ticketsSold", value)} />
                <NumberInput label="Check-ins" value={form.checkinsCount} onChange={(value) => updateField("checkinsCount", value)} />
              </div>

              <div className="flex gap-3 pt-2">
                {form.id ? (
                  <button
                    type="button"
                    onClick={() => {
                      const event = events.find((item) => item.id === form.id);
                      if (event) {
                        openDeleteConfirmation(event);
                      }
                    }}
                    className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-[#d9e0eb] bg-white text-sm font-semibold text-[#66758f] transition hover:bg-[#f3f5f9]"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[#f79009] text-sm font-semibold text-white transition hover:bg-[#e88507] disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />
                  {submitting ? "Saving..." : form.id ? "Save" : "Create"}
                </button>
              </div>
            </form>
          </aside>
        </div>
      </div>

      {eventToDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg border border-[#d9e0eb] bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#0f1c3f]">Delete event?</h2>
                <p className="mt-2 text-sm leading-6 text-[#5f7190]">
                  This will permanently delete <span className="font-semibold text-[#0f1c3f]">{eventToDelete.title}</span> from your creator profile and Sponsor Discover.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEventToDelete(null)}
                className="rounded-lg p-2 text-[#66758f] transition hover:bg-[#f3f5f9] hover:text-[#0f1c3f]"
                aria-label="Cancel delete"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setEventToDelete(null)}
                disabled={deleting}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-lg border border-[#d9e0eb] bg-white text-sm font-semibold text-[#66758f] transition hover:bg-[#f3f5f9] disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={deleteEvent}
                disabled={deleting}
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" />
                {deleting ? "Deleting..." : "Delete event"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#d9e0eb] bg-white p-5">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#fef7ef] text-[#f79009]">
        {icon}
      </div>
      <p className="text-2xl font-bold text-[#0f1c3f]">{value}</p>
      <p className="text-sm text-[#6b7e9e]">{label}</p>
    </div>
  );
}

const TextInput = ({
  label,
  value,
  onChange,
  required,
  ref,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  ref?: React.Ref<HTMLInputElement>;
}) => {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-[#0f1c3f]">{label}</span>
      <input
        ref={ref}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="h-10 w-full rounded-lg border border-[#d9e0eb] px-3 text-sm text-[#0f1c3f] outline-none transition focus:border-[#f79009]"
      />
    </label>
  );
};

function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-[#0f1c3f]">{label}</span>
      <input
        type="number"
        min="0"
        step="1"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-[#d9e0eb] px-3 text-sm text-[#0f1c3f] outline-none transition focus:border-[#f79009]"
      />
    </label>
  );
}

function DateInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-[#0f1c3f]">{label}</span>
      <input
        type="datetime-local"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        className="h-10 w-full rounded-lg border border-[#d9e0eb] px-3 text-sm text-[#0f1c3f] outline-none transition focus:border-[#f79009]"
      />
    </label>
  );
}

function SelectInput({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<[string, string]>;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-[#0f1c3f]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-[#d9e0eb] bg-white px-3 text-sm text-[#0f1c3f] outline-none transition focus:border-[#f79009]"
      >
        {options.map(([optionValue, labelText]) => (
          <option key={optionValue} value={optionValue}>
            {labelText}
          </option>
        ))}
      </select>
    </label>
  );
}
