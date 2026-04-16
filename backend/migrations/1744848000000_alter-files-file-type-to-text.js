/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.up = (pgm) => {
    pgm.alterColumn('files', 'file_type', { type: 'text' });
};

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.down = (pgm) => {
    pgm.alterColumn('files', 'file_type', { type: 'varchar(36)' });
};
