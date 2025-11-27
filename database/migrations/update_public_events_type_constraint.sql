-- Update the CHECK constraint for the type column in public_events table
-- to include SOLAR_TERM and SEASONAL_DAY types
-- Also add the UNIQUE constraint to prevent duplicate events on the same date with the same name

-- First drop the existing constraint
ALTER TABLE public_events
DROP CONSTRAINT IF EXISTS public_events_type_check;

-- Add the updated constraint
ALTER TABLE public_events
ADD CONSTRAINT public_events_type_check CHECK (type IN ('HOLIDAY', 'NOTICE', 'SOLAR_TERM', 'SEASONAL_DAY'));

-- Add the unique constraint if it doesn't exist
ALTER TABLE public_events
ADD CONSTRAINT IF NOT EXISTS unique_public_event_date_title UNIQUE (date, title);