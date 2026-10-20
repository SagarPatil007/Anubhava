ALTER TABLE IF EXISTS anb_events
    ALTER COLUMN thumbnail_url TYPE TEXT;

ALTER TABLE IF EXISTS anb_event_images
    ALTER COLUMN image_url TYPE TEXT;
