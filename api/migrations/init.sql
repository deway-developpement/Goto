USE Goto;

# fill the database with some initial data
INSERT INTO
    user (
        id,
        pseudo,
        password,
        email,
        publicKey,
        credidential,
        createdAt
    )
VALUES (
        uuid(),
        'admin',
        '$2b$10$omYQk0C0C6wKi34usPe1xOVIOylraIn1uzO9RZMGHIiH1yF4YZ3.S',
        'admin@localhost',
        'ROOT',
        2,
        now()
    );

# non admin user
INSERT INTO
    user (
        id,
        pseudo,
        password,
        email,
        publicKey,
        credidential,
        createdAt
    )
VALUES (
        uuid(),
        'user',
        '$2b$10$omYQk0C0C6wKi34usPe1xOgv8Lka3rLjbYHd9V9lm0VPq6auAjSM.',
        'user@localhost',
        'USER01',
        1,
        now()
    );

INSERT INTO
    user (
        id,
        pseudo,
        password,
        email,
        publicKey,
        credidential,
        createdAt
    )
VALUES (
        uuid(),
        'user2',
        '$2b$10$omYQk0C0C6wKi34usPe1xOgv8Lka3rLjbYHd9V9lm0VPq6auAjSM.',
        'user2@localhost',
        'USER02',
        1,
        now()
    );

# Create a category
INSERT INTO
    category (id, name, createdAt)
VALUES (uuid(), 'Category 1', now());

# Create a category
INSERT INTO
    category (id, name, createdAt)
VALUES (uuid(), 'Category 2', now());

# Create a hike
INSERT INTO
    hike (
        id,
        name,
        distance,
        elevation,
        duration,
        description,
        difficulty,
        track,
        createdAt,
        latitude,
        longitude,
        ownerId,
        categoryId
    )
VALUES (
        uuid(),
        'Hike 1',
        40,
        500,
        11,
        'Hike 1 description',
        1,
        'track1.gpx',
        now(),
        1.234567,
        1.234567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'admin'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            LIMIT 1
        )
    );

# Create a hike
INSERT INTO
    hike (
        id,
        name,
        distance,
        elevation,
        duration,
        description,
        difficulty,
        track,
        createdAt,
        latitude,
        longitude,
        ownerId,
        categoryId
    )
VALUES (
        uuid(),
        'Hike 2',
        45,
        600,
        13.5,
        'Hike 2 description',
        2,
        'track2.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'user'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            LIMIT 1
        )
    );

INSERT INTO
    hike (
        id,
        name,
        distance,
        elevation,
        duration,
        description,
        difficulty,
        track,
        createdAt,
        latitude,
        longitude,
        ownerId,
        categoryId
    )
VALUES (
        uuid(),
        'Hike 3',
        40,
        500,
        11,
        'Hike 3 description',
        1,
        'track3.gpx',
        now(),
        1.234567,
        1.234567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'admin'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            LIMIT 1
        )
    );

INSERT INTO
    hike (
        id,
        name,
        distance,
        elevation,
        duration,
        description,
        difficulty,
        track,
        createdAt,
        latitude,
        longitude,
        ownerId,
        categoryId
    )
VALUES (
        uuid(),
        'Hike 4',
        40,
        500,
        11,
        'Hike 4 description',
        1,
        'track4.gpx',
        now(),
        1.234567,
        1.234567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'admin'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            LIMIT 1
        )
    );

# Create a POI
INSERT INTO
    pointOfInterest (
        id,
        name,
        description,
        latitude,
        longitude,
        url,
        createdAt
    )
VALUES (
        uuid(),
        'POI 1',
        'POI 1 description',
        -45.123456,
        6.123456,
        'https://www.google.com',
        now()
    );

# Create a POI
INSERT INTO
    pointOfInterest (
        id,
        name,
        description,
        latitude,
        longitude,
        url,
        createdAt
    )
VALUES (
        uuid(),
        'POI 2',
        'POI 2 description',
        -45.123456,
        6.123456,
        'https://www.google.com',
        now()
    );

# Create a tag
INSERT INTO
    tag (id, name, createdAt)
VALUES (uuid(), 'Tag 1', now());

# Create a tag
INSERT INTO
    tag (id, name, createdAt)
VALUES (uuid(), 'Tag 2', now());

# Create a photo
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '302611014573228032.jpg',
        now(), (
            SELECT id
            FROM hike
            LIMIT 1
        )
    );

# Create a photo
INSERT INTO
    photo (
        id,
        filename,
        createdAt,
        pointOfInterestId
    )
VALUES (
        uuid(),
        '302611316751859712.jpg',
        now(), (
            SELECT id
            FROM
                pointOfInterest
            LIMIT 1
        )
    );

# Create a photo
INSERT INTO
    photo (id, filename, createdAt, userId)
VALUES (
        uuid(),
        '302611691068325888.jpg',
        now(), (
            SELECT id
            FROM user
            LIMIT 1
        )
    );

# Add a tag to a hike 
INSERT INTO
    hikes_tags (hikeId, tagId)
VALUES ( (
            SELECT id
            FROM hike
            LIMIT 1
        ), (
            SELECT id
            FROM tag
            LIMIT 1
        )
    );

# Add a friend to a user
INSERT INTO
    users_friends (`userId_1`, `userId_2`)
VALUES ( (
            SELECT id
            FROM user
            WHERE
                pseudo = 'admin'
            LIMIT 1
        ), (
            SELECT id
            FROM user
            WHERE
                pseudo = 'user'
            LIMIT 1
        )
    );

# Add a POI to a hike
INSERT INTO
    hikes_pointsOfInterest (hikeId, pointOfInterestId)
VALUES ( (
            SELECT id
            FROM hike
            LIMIT 1
        ), (
            SELECT id
            FROM
                pointOfInterest
            LIMIT 1
        )
    );

# Add a performance to a hike
INSERT INTO
    performance (
        id,
        date,
        distance,
        duration,
        elevation,
        track,
        createdAt,
        hikeId,
        userId
    )
VALUES (
        uuid(),
        now(),
        40,
        11,
        500,
        '301803712811237376.gpx',
        now(), (
            SELECT id
            FROM hike
            LIMIT 1
        ), (
            SELECT id
            FROM user
            WHERE
                pseudo = 'admin'
            LIMIT 1
        )
    );

# Add a performance to a hike
INSERT INTO
    performance (
        id,
        date,
        distance,
        duration,
        elevation,
        track,
        createdAt,
        hikeId,
        userId
    )
VALUES (
        uuid(),
        now(),
        45,
        13.5,
        600,
        '301803712811237377.gpx',
        now(), (
            SELECT id
            FROM hike
            LIMIT 1
        ), (
            SELECT id
            FROM user
            WHERE
                pseudo = 'user'
            LIMIT 1
        )
    );

# Add a review to a hike
INSERT INTO
    review (
        id,
        rating,
        createdAt,
        hikeId,
        userId
    )
VALUES (
        uuid(), 5, now(), (
            SELECT id
            FROM hike
            LIMIT 1
        ), (
            SELECT id
            FROM user
            WHERE
                pseudo = 'admin'
            LIMIT 1
        )
    );

# Add a review to a hike
INSERT INTO
    review (
        id,
        rating,
        createdAt,
        hikeId,
        userId
    )
VALUES (
        uuid(), 4, now(), (
            SELECT id
            FROM hike
            LIMIT 1
        ), (
            SELECT id
            FROM user
            WHERE
                pseudo = 'user'
            LIMIT 1
        )
    );

# Create a alert
INSERT INTO
    alert (
        id,
        type,
        latitude,
        longitude,
        createdAt,
        authorId,
        hikeId
    )
VALUES (
        uuid(),
        1,
        1,
        1,
        now(), (
            SELECT id
            FROM user
            WHERE
                pseudo = 'admin'
            LIMIT 1
        ), (
            SELECT id
            FROM hike
            LIMIT 1
        )
    );

# Create a alert
INSERT INTO
    alert (
        id,
        type,
        latitude,
        longitude,
        createdAt,
        authorId,
        hikeId
    )
VALUES (
        uuid(),
        4,
        1.1,
        1.2,
        now(), (
            SELECT id
            FROM user
            WHERE
                pseudo = 'user'
            LIMIT 1
        ), (
            SELECT id
            FROM hike
            LIMIT 1
        )
    );