const pool = require('../configs/dbConfig')

async function initDB() {
    const client = await pool.connect()

    try {
        await client.query('BEGIN')

        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                role VARCHAR(50) NOT NULL DEFAULT 'user',
                password VARCHAR(255) NOT NULL,
                refresh_token TEXT DEFAULT NULL,
                created_at TIMESTAMP not null DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `)
        await client.query(`
            CREATE TABLE IF NOT EXISTS blacklist_token (
                id SERIAL PRIMARY KEY,
                token TEXT not null unique,
                time_expired TIMESTAMP NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `)

        await client.query(`
            CREATE TABLE IF NOT EXISTS artists (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL unique,
                name VARCHAR(255) not null unique,
                sex varchar(50) default 'unknown',
                birth_date Timestamp,
                nationality varchar(50) default 'unknown',
                profile_image text default 'unknown',
                created_at TIMESTAMP not null DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                constraint fk_user
                    foreign key(user_id)
                    references users(id)
                    on delete cascade
            );
        `)

        await client.query(`
            CREATE TABLE IF NOT EXISTS gallerys (
                id SERIAL PRIMARY KEY,
                artist_id INT NOT NULL,
                title VARCHAR(255) not null default 'untitled',
                image_path text not null,
                created_at TIMESTAMP not null DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                constraint fk_user
                    foreign key(artist_id)
                    references artists(id)
                    on delete cascade
            );
        `)

        await client.query(`COMMIT`)
        console.log('Database initialized successfully')
    }catch (error) {
        await client.query('ROLLBACK')
        throw error
    }finally {
        client.release()
    }
}

module.exports = initDB