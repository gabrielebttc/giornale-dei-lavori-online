/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.up = (pgm) => {
    pgm.createTable('file_templates', {
        id: { type: 'serial', primaryKey: true },
        name: { type: 'varchar(255)', notNull: true },
        file_type: { type: 'text', notNull: true },
        storage_key: { type: 'text', notNull: true, unique: true },
        tag: { type: 'varchar(50)' },
        owner_id: {
            type: 'integer',
            notNull: true,
            references: '"users"',
            onDelete: 'cascade',
        },
        created_at: {
            type: 'timestamp',
            default: pgm.func('CURRENT_TIMESTAMP'),
        },
    });
};

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.down = (pgm) => {
    pgm.dropTable('file_templates');
};
