-- Add UNIQUE constraint on (date, title) for public_events table
-- This prevents duplicate events on the same date with the same name

ALTER TABLE public_events
ADD CONSTRAINT unique_public_event_date_title UNIQUE (date, title);
