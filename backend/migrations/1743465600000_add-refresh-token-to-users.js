exports.up = (pgm) => {
  pgm.sql(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'refresh_token'
      ) THEN
        ALTER TABLE users ADD COLUMN refresh_token text;
      END IF;
    END
    $$;
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'refresh_token'
      ) THEN
        ALTER TABLE users DROP COLUMN refresh_token;
      END IF;
    END
    $$;
  `);
};
