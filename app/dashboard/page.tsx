"use client";

import { useState, FormEvent } from "react";
import { Authenticated, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Send, Trash2, MessageSquare } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Live demo of Clerk + Convex working together. Messages are scoped to
          your account and sync across tabs in real time.
        </p>
      </div>
      <Authenticated>
        <Messages />
      </Authenticated>
    </div>
  );
}

function Messages() {
  const messages = useQuery(api.messages.list);
  const send = useMutation(api.messages.send);
  const remove = useMutation(api.messages.remove);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!body.trim() || submitting) return;
    setSubmitting(true);
    try {
      await send({ body });
      setBody("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 rounded-lg border border-neutral-200 p-2 bg-white"
      >
        <input
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a message…"
          className="flex-1 px-3 py-2 bg-transparent outline-none text-sm placeholder:text-neutral-400"
        />
        <button
          type="submit"
          disabled={!body.trim() || submitting}
          className="inline-flex items-center gap-2 rounded-md bg-neutral-900 text-white px-3 py-2 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-800 transition"
        >
          <Send className="size-4" strokeWidth={2.25} />
          Send
        </button>
      </form>

      <div>
        <div className="flex items-center gap-2 mb-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
          <MessageSquare className="size-3.5" strokeWidth={2.25} />
          Your messages
          {messages && (
            <span className="text-neutral-400 normal-case tracking-normal">
              ({messages.length})
            </span>
          )}
        </div>

        {messages === undefined && (
          <div className="rounded-lg border border-neutral-200 px-4 py-8 text-sm text-neutral-500 text-center">
            Loading…
          </div>
        )}

        {messages && messages.length === 0 && (
          <div className="rounded-lg border border-dashed border-neutral-300 px-4 py-12 text-sm text-neutral-500 text-center">
            No messages yet. Send your first one above.
          </div>
        )}

        {messages && messages.length > 0 && (
          <ul className="divide-y divide-neutral-200 rounded-lg border border-neutral-200">
            {messages.map((m) => (
              <li
                key={m._id}
                className="flex items-start justify-between gap-4 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm break-words">{m.body}</p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {new Date(m._creationTime).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => remove({ id: m._id })}
                  className="shrink-0 p-1.5 text-neutral-400 hover:text-neutral-900 transition"
                  aria-label="Delete message"
                >
                  <Trash2 className="size-4" strokeWidth={2.25} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
