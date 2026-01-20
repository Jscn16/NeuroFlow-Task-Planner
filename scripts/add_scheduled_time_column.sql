-- Add scheduled_time column to tasks table
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS scheduled_time TEXT;

-- Create index for performance on queries filtering by time (optional but good practice)
CREATE INDEX IF NOT EXISTS idx_tasks_scheduled_time ON tasks(scheduled_time);

-- Comment
COMMENT ON COLUMN tasks.scheduled_time IS 'Time of day for the task in HH:mm format (24h)';
