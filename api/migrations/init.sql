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
        ownerId
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
        now(), (
            SELECT id
            FROM user
            WHERE
                pseudo = 'admin'
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
        ownerId
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
        now(), (
            SELECT id
            FROM user
            WHERE
                pseudo = 'user'
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
        'photo1.jpg',
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
        'photo2.jpg',
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
        'photo3.jpg',
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