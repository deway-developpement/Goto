USE Goto;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE hike;

TRUNCATE TABLE category;

TRUNCATE TABLE user;

TRUNCATE TABLE photo;

TRUNCATE TABLE review;

TRUNCATE TABLE tag;

TRUNCATE TABLE hikes_pointsOfInterest;

TRUNCATE TABLE pointOfInterest;

TRUNCATE TABLE users_friends;

TRUNCATE TABLE alert;

TRUNCATE TABLE hikes_tags;

TRUNCATE TABLE performance;

# fill the database with some initial data
INSERT INTO
    user (
        id,
        pseudo,
        password,
        email,
        publicKey,
        credidential,
        public,
        createdAt
    )
VALUES (
        uuid(),
        'admin',
        '$2b$10$omYQk0C0C6wKi34usPe1xOVIOylraIn1uzO9RZMGHIiH1yF4YZ3.S',
        'admin@deway.fr',
        'ROOT',
        2,
        true,
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
        public,
        createdAt
    )
VALUES (
        uuid(),
        'Mike',
        '$2b$10$omYQk0C0C6wKi34usPe1xOgv8Lka3rLjbYHd9V9lm0VPq6auAjSM.',
        'Mike@deway.fr',
        'USER01',
        1,
        true,
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
        public,
        createdAt
    )
VALUES (
        uuid(),
        'James',
        '$2b$10$omYQk0C0C6wKi34usPe1xOgv8Lka3rLjbYHd9V9lm0VPq6auAjSM.',
        'James@deway.fr',
        'USER02',
        1,
        true,
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
        public,
        createdAt
    )
VALUES (
        uuid(),
        'Lea',
        '$2b$10$omYQk0C0C6wKi34usPe1xOgv8Lka3rLjbYHd9V9lm0VPq6auAjSM.',
        'Lea@deway.fr',
        'USER03',
        1,
        false,
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
        'Tom',
        '$2b$10$omYQk0C0C6wKi34usPe1xOgv8Lka3rLjbYHd9V9lm0VPq6auAjSM.',
        'Tom@deway.fr',
        'USER04',
        1,
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
        public,
        createdAt
    )
VALUES (
        uuid(),
        'Jeanne',
        '$2b$10$omYQk0C0C6wKi34usPe1xOgv8Lka3rLjbYHd9V9lm0VPq6auAjSM.',
        'Jeanne@deway.fr',
        'USER05',
        1,
        true,
        now()
    );

# Create a category
INSERT INTO
    category (id, name, createdAt)
VALUES (uuid(), 'Forest', now());

# Create a category
INSERT INTO
    category (id, name, createdAt)
VALUES (uuid(), 'Desert', now());

# Create a category
INSERT INTO
    category (id, name, createdAt)
VALUES (uuid(), 'Mountains', now());

# Create a category
INSERT INTO
    category (id, name, createdAt)
VALUES (uuid(), 'Riverside', now());

# Create a category
INSERT INTO
    category (id, name, createdAt)
VALUES (uuid(), 'Seaside', now());

# Create a category
INSERT INTO
    category (id, name, createdAt)
VALUES (uuid(), 'Lake', now());

# Create a category
INSERT INTO
    category (id, name, createdAt)
VALUES (uuid(), 'City', now());

# Create a category
INSERT INTO
    category (id, name, createdAt)
VALUES (uuid(), 'Plains', now());

# Create a category
INSERT INTO
    category (id, name, createdAt)
VALUES (uuid(), 'Tundra', now());

# Create a hike 1
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
        'Forest tour',
        2,
        100,
        0.5,
        'A small 2 km tour in the forest',
        1,
        '119967546323880647.gpx',
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
            WHERE
                name = 'Forest'
            LIMIT 1
        )
    );

# Create a hike 2
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
        'Cliffside walk',
        30,
        600,
        13.5,
        'A long walk along the cliffside',
        2,
        '544788107478814292.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Tom'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE
                name = 'Mountains'
            LIMIT 1
        )
    );

# Create a hike 3
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
        'Seaside walk',
        45,
        600,
        13.5,
        'Feel the sea breeze with this tour along the seaside',
        2,
        '495385891592999984.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Lea'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE
                name = 'Seaside'
            LIMIT 1
        )
    );

# Create a hike 4
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
        'Frost encounter',
        58,
        2000,
        20,
        'Encounter the wildlife with this tour in the tundra',
        3,
        '514106900840295724.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Jeanne'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE
                name = 'Tundra'
            LIMIT 1
        )
    );

# Create a hike 5
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
        'Lake tour',
        4,
        50,
        1,
        'A simple tour around the lake',
        1,
        '419973701745457474.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Lea'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE name = 'Lake'
            LIMIT 1
        )
    );

# Create a hike 6
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
        'Tour around the lake',
        7,
        100,
        2,
        'Walk around the lake and encounter the wildlife',
        2,
        '373158958072184818.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Tom'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE name = 'Lake'
            LIMIT 1
        )
    );

# Create a hike 7
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
        'Tour around the city',
        10,
        200,
        2.5,
        'Visit the main monuments of the city',
        1,
        '926735909369588564.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'James'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE name = 'City'
            LIMIT 1
        )
    );

# Create a hike 8
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
        'Mountain challenge',
        12,
        1200,
        5,
        'Walk along a difficult path in the mountain',
        3,
        '645117252567792649.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Mike'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE
                name = 'Mountains'
            LIMIT 1
        )
    );

# Create a hike 9
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
        'Enjoy the river',
        2,
        50,
        0.5,
        'Walk along the river and enjoy the breeze',
        2,
        '472993022782147631.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Mike'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE
                name = 'Riverside'
            LIMIT 1
        )
    );

# Create a hike 10
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
        'Desert discovery',
        15,
        800,
        7,
        'Discover the life in the desert with this long walk',
        3,
        '781186673160078000.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'James'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE
                name = 'Desert'
            LIMIT 1
        )
    );

# Create a hike 11
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
        'Countriside tour',
        30,
        800,
        12,
        'Discover the countriside with numerous villages',
        2,
        '914814813167629249.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Lea'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE
                name = 'Plains'
            LIMIT 1
        )
    );

# Create a hike 12
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
        'Desert encounter',
        5,
        300,
        1.5,
        'Encounter wild animals in the desert',
        2,
        '930567485006079198.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Lea'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE
                name = 'Desert'
            LIMIT 1
        )
    );

# Create a hike 13
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
        'Coastal walk',
        30,
        2000,
        14,
        'Walk along the coast and enjoy the view',
        3,
        '396822159105403089.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Mike'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE
                name = 'Seaside'
            LIMIT 1
        )
    );

# Create a hike 14
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
        'Mountain tour',
        20,
        1300,
        9,
        'Enjoy the mountain to its fullest with this hike',
        3,
        '701704109106772176.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Lea'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE
                name = 'Mountains'
            LIMIT 1
        )
    );

# Create a hike 15
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
        'River tour',
        12,
        250,
        3.5,
        'Enjoy following the river to diconnect from the world',
        2,
        '440512793897022359.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Jeanne'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE
                name = 'Riverside'
            LIMIT 1
        )
    );

# Create a hike 16
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
        'Tundra tour',
        5,
        100,
        1.5,
        'A small tour in the tundra',
        1,
        '851403187520298648.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Lea'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE
                name = 'Tundra'
            LIMIT 1
        )
    );

# Create a hike 17
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
        'Desert discovery tour',
        10,
        300,
        3,
        'Discover the desert with this beautiful tour',
        1,
        '856830624186211911.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Lea'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE
                name = 'Desert'
            LIMIT 1
        )
    );

# Create a hike 18
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
        'walk along the seaside',
        2,
        100,
        0.5,
        'walk along the seaside and enjoy the fresh air',
        1,
        '783207525602140317.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Tom'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE
                name = 'Seaside'
            LIMIT 1
        )
    );

# Create a hike 19
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
        'City discovery',
        6,
        300,
        1.5,
        'Discover the city with this tour',
        2,
        '954903225231572609.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Tom'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE name = 'City'
            LIMIT 1
        )
    );

# Create a hike 20
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
        'Monument tour',
        7,
        400,
        2,
        'Discover the amazing monuments of the city',
        1,
        '690269030716993180.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'James'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE name = 'City'
            LIMIT 1
        )
    );

# Create a hike 21
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
        'Lake visit',
        15,
        900,
        6,
        'Visit the lake and enjoy the view',
        3,
        '707551639512049627.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'James'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE name = 'Lake'
            LIMIT 1
        )
    );

# Create a hike 22
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
        'Riverside walk',
        35,
        1300,
        12,
        'Walk along the river and enjoy the landscape',
        3,
        '362486179900529896.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Mike'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE
                name = 'Riverside'
            LIMIT 1
        )
    );

# Create a hike 23
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
        'Village tour',
        20,
        1100,
        7,
        'Visit the villages and enjoy your time',
        3,
        '129550493912493164.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Mike'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE
                name = 'Plains'
            LIMIT 1
        )
    );

# Create a hike 24
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
        'Mountain climb',
        25,
        1300,
        8,
        'Climb the mountain. Can you reach the top ?',
        3,
        '363350354192895214.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Jeanne'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE
                name = 'Mountains'
            LIMIT 1
        )
    );

# Create a hike 25
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
        'A walk in the plains',
        11,
        200,
        3,
        'Plains are beautiful. Enjoy the view',
        2,
        '755115377211516020.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Jeanne'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE
                name = 'Plains'
            LIMIT 1
        )
    );

# Create a hike 26
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
        'Maritime walk',
        1,
        50,
        0.25,
        'Short walk along the seaside',
        1,
        '682304939669910243.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Lea'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE
                name = 'Seaside'
            LIMIT 1
        )
    );

# Create a hike 27
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
        'Sightseeing tour',
        30,
        1500,
        10,
        'Sightseeing tour of the city',
        2,
        '681399726716772029.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'James'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE name = 'City'
            LIMIT 1
        )
    );

# Create a hike 28
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
        'Forest hike',
        50,
        3500,
        20,
        'Take a long walk in the forest and enjoy the wildlife',
        3,
        '234504017844374728.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Jeanne'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE
                name = 'Forest'
            LIMIT 1
        )
    );

# Create a hike 29
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
        'Around the lake',
        20,
        1400,
        10,
        'Walk around the lake with this beautiful hike',
        3,
        '584271228217008529.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Tom'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE name = 'Lake'
            LIMIT 1
        )
    );

# Create a hike 30
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
        'Cliffside hike',
        45,
        800,
        14,
        'Climb the cliffside and enjoy the view',
        2,
        '890572120612151705.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Mike'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE
                name = 'Mountains'
            LIMIT 1
        )
    );

# Create a hike 31
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
        'Walk next to the lake',
        30,
        1000,
        10,
        'Next to the lake, enjoy the wildlife',
        2,
        '949714241037182260.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Mike'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE name = 'Lake'
            LIMIT 1
        )
    );

# Create a hike 32
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
        'To the top',
        2,
        700,
        2,
        'Get to the top of the mountain',
        3,
        '302880670400631572.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Lea'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE
                name = 'Mountains'
            LIMIT 1
        )
    );

# Create a hike 33
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
        'Hot walk',
        25,
        600,
        8,
        'Hot walk in the desert',
        3,
        '278546037400188923.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Jeanne'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE
                name = 'Desert'
            LIMIT 1
        )
    );

# Create a hike 34
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
        'Cold walk',
        20,
        700,
        6,
        'Cold walk in the tundra',
        2,
        '621043714428426341.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Lea'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE
                name = 'tundra'
            LIMIT 1
        )
    );

# Create a hike 35
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
        'Track the wildlife',
        30,
        600,
        10,
        'Trees and animals are everywhere in the forest.',
        2,
        '120169892030349748.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'James'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE
                name = 'Forest'
            LIMIT 1
        )
    );

# Create a hike 36
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
        'Tree walk',
        5,
        100,
        1.5,
        'Find the most beautiful trees in the forest',
        1,
        '595218665631792658.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Tom'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE
                name = 'Forest'
            LIMIT 1
        )
    );

# Create a hike 37
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
        'Arid walk',
        3,
        50,
        1,
        'Discover the arid desert with this short walk',
        1,
        '862580781376188747.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Lea'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE
                name = 'Desert'
            LIMIT 1
        )
    );

# Create a hike 38
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
        'Maritime escape',
        14,
        200,
        3,
        'Maritime escape with this hike along the seaside',
        1,
        '539586486117253931.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'James'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE
                name = 'Seaside'
            LIMIT 1
        )
    );

# Create a hike 39
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
        'Hike along the lake',
        4,
        400,
        1,
        'Hike along the lake and enjoy the view',
        2,
        '162386751766823858.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Jeanne'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE name = 'Lake'
            LIMIT 1
        )
    );

# Create a hike 40
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
        'Wild walk',
        16,
        300,
        5,
        'Walk in the desert and enjoy the wildlife',
        3,
        '435865665146641546.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Lea'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE
                name = 'Desert'
            LIMIT 1
        )
    );

# Create a hike 41
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
        'Cold hike',
        40,
        900,
        15,
        'This beautiful hike in the tundra will make you feel refreshed',
        3,
        '141154008897876714.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Mike'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE
                name = 'Tundra'
            LIMIT 1
        )
    );

# Create a hike 42
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
        'Challenging the mountain',
        68,
        4500,
        22,
        'Can you get to the top of the mountain ?',
        3,
        '414828940070498945.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Tom'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE
                name = 'Mountains'
            LIMIT 1
        )
    );

# Create a hike 43
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
        'River challenge',
        50,
        2000,
        14,
        'Challenge the river and follow it to the end',
        3,
        '776966092053725956.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Mike'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE
                name = 'Riverside'
            LIMIT 1
        )
    );

# Create a hike 44
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
        'Beach walk',
        18,
        200,
        5,
        'Beach walk along the seaside',
        1,
        '446982622136775859.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Lea'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE
                name = 'Seaside'
            LIMIT 1
        )
    );

# Create a hike 45
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
        'Simple sightseeing tour',
        35,
        800,
        10,
        'Simple sightseeing tour of the city',
        2,
        '133530073888971645.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Tom'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE name = 'City'
            LIMIT 1
        )
    );

# Create a hike 46
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
        'Village escape',
        3,
        100,
        1,
        'Find the most beautiful villages of the region',
        1,
        '954281028344406219.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'James'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE
                name = 'Plains'
            LIMIT 1
        )
    );

# Create a hike 47
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
        'Monument discovery hike',
        7,
        150,
        2,
        'Find the best monuments of the city',
        1,
        '555724507049829342.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Lea'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE name = 'City'
            LIMIT 1
        )
    );

# Create a hike 48
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
        'Maritime hike',
        2,
        50,
        0.5,
        'Small hike along the seaside',
        1,
        '693778447586461315.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Jeanne'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE
                name = 'Seaside'
            LIMIT 1
        )
    );

# Create a hike 49
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
        'Field view',
        6,
        50,
        1.5,
        'View the fields with this short walk',
        1,
        '503136481947640073.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Mike'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE
                name = 'Plains'
            LIMIT 1
        )
    );

# Create a hike 50
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
        'Stump walk',
        25,
        500,
        10,
        'Stump walk in the forest',
        3,
        '391861769756997164.gpx',
        now(),
        1.434567,
        1.434567, (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Tom'
            LIMIT 1
        ), (
            SELECT id
            FROM category
            WHERE
                name = 'Forest'
            LIMIT 1
        )
    );

# Create a POI 1
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
        'Eiffel Tower',
        'The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower.',
        -44.123456,
        7.123456,
        'https://www.google.com',
        now()
    );

# Create a POI 2
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
        'Versailles Castle',
        'The Palace of Versailles was the principal royal residence of France from 1682, under Louis XIV, until the start of the French Revolution in 1789, under Louis XVI.',
        -45.123456,
        6.123456,
        'https://www.google.com',
        now()
    );

# Create a POI 3
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
        'Giza Pyramid',
        'The Great Pyramid of Giza is the oldest and largest of the three pyramids in the Giza pyramid complex bordering present-day Giza in Greater Cairo, Egypt.',
        -5.925421,
        -32.330961,
        'https://www.google.com',
        now()
    );

# Create a POI 4
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
        'Notre Dame de Paris',
        'Notre-Dame de Paris, referred to simply as Notre-Dame, is a medieval Catholic cathedral on the Île de la Cité in the 4th arrondissement of Paris.',
        -58.888724,
        -5.925421,
        'https://www.google.com',
        now()
    );

# Create a POI 5
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
        'Rome Colosseum',
        'The Colosseum or Coliseum, also known as the Flavian Amphitheatre, is an oval amphitheatre in the centre of the city of Rome, Italy.',
        10.171803,
        19.595881,
        'https://www.google.com',
        now()
    );

# Create a POI 5.5
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
        'Stonehenge',
        'Stonehenge is a prehistoric monument in Wiltshire, England, two miles west of Amesbury. It consists of a ring of standing stones, with each standing stone around 13 feet high, seven feet wide and weighing around 25 tons.',
        0.416015,
        -19.526815,
        'https://www.google.com',
        now()
    );

# Create a POI 6
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
        'Athens Acropolis',
        'The Acropolis of Athens is an ancient citadel located on a rocky outcrop above the city of Athens and contains the remains of several ancient buildings of great architectural and historic significance.',
        7.470623,
        -43.743615,
        'https://www.google.com',
        now()
    );

# Create a POI 7
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
        'Berlin Wall',
        'The Berlin Wall was a guarded concrete barrier that physically and ideologically divided Berlin from 1961 to 1989. Constructed by the German Democratic Republic, starting on 13 August 1961, the Wall cut off West Berlin from virtually all of surrounding East Germany and East Berlin until government officials opened it in November 1989.',
        -2.565646,
        -22.124528,
        'https://www.google.com',
        now()
    );

# Create a POI 8
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
        'Cologne Cathedral',
        'Cologne Cathedral is a Catholic cathedral in Cologne, North Rhine-Westphalia, Germany. It is the seat of the Archbishop of Cologne and of the administration of the Archdiocese of Cologne. It is a renowned monument of German Catholicism and Gothic architecture and is a World Heritage Site.',
        -0.922726,
        -36.271434,
        'https://www.google.com',
        now()
    );

# Create a POI 9
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
        'Kremlin',
        "The Moscow Kremlin, or simply the Kremlin, is a fortified complex in the center of Moscow, overlooking the Moskva River to the south, Saint Basil's Cathedral and Red Square to the east, and the Alexander Garden to the west. It is the best known of the kremlins and includes five palaces, four cathedrals, and the enclosing Kremlin Wall with Kremlin towers. Also within this complex is the Grand Kremlin Palace. The complex serves as the official residence of the President of the Russian Federation.",
        47.852021,
        47.852021,
        'https://www.google.com',
        now()
    );

# Create a POI 10
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
        'London Tower',
        'Her Majesty’s Royal Palace and Fortress, more commonly known as the Tower of London, is a historic castle on the north bank of the River Thames in central London, England. It lies within the London Borough of Tower Hamlets, separated from the eastern edge of the square mile of the City of London by the open space known as Tower Hill. It was founded towards the end of 1066 as part of the Norman Conquest of England. The White Tower, which gives the entire castle its name, was built by William the Conqueror in 1078 and was a resented symbol of oppression, inflicted upon London by the new ruling elite. The castle was used as a prison from 1100 until 1952, although that was not its primary purpose. A grand palace early in its history, it served as a royal residence. As a whole, the Tower is a complex of several buildings set within two concentric rings of defensive walls and a moat. There were several phases of expansion, mainly under Kings Richard I, Henry III, and Edward I in the 12th and 13th centuries. The general layout established by the late 13th century remains despite later activity on the site.',
        46.153902,
        -42.186999,
        'https://www.google.com',
        now()
    );

# Create a POI 11
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
        'Machu Picchu',
        'Machu Picchu is a 15th-century Inca citadel situated on a mountain ridge 2,430 metres above sea level. It is located in the Cusco Region, Urubamba Province, Machupicchu District in Peru, above the Sacred Valley, which is 80 kilometres northwest of Cuzco and through which the Urubamba River flows.',
        40.481602,
        -54.480701,
        'https://www.google.com',
        now()
    );

# Create a POI 12
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
        'Neuschwanstein Castle',
        'Neuschwanstein Castle is a 19th-century Romanesque Revival palace on a rugged hill above the village of Hohenschwangau near Füssen in southwest Bavaria, Germany. The palace was commissioned by King Ludwig II of Bavaria as a retreat and in honour of Richard Wagner. Ludwig paid for the palace out of his personal fortune and by means of extensive borrowing, rather than Bavarian public funds.',
        -54.081521,
        -10.062415,
        'https://www.google.com',
        now()
    );

# Create a POI 13
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
        'Pompeii',
        'Pompeii was an ancient Roman city near modern Naples in the Campania region of Italy, in the territory of the comune of Pompei. Pompeii, along with Herculaneum and many villas in the surrounding area, was buried under 4 to 6 m of volcanic ash and pumice in the eruption of Mount Vesuvius in AD 79. Volcanic ash typically buried inhabitants who did not escape the lethal effects of the earthquake and eruption. Pompeii is a UNESCO World Heritage Site status and is one of the most popular tourist attractions in Italy, with approximately 2.5 million visitors annually.',
        -3.711265,
        43.147053,
        'https://www.google.com',
        now()
    );

# Create a POI 14
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
        'Queenstown',
        "Queenstown is a resort town in Otago in the south-west of New Zealand's South Island. It has an urban population of 15,300, making it the 27th-largest urban area in New Zealand. In 2016, Queenstown overtook Oamaru to become the second-largest urban area in Otago, behind Dunedin. The town is built around an inlet called Queenstown Bay on Lake Wakatipu, a long, thin, Z-shaped lake formed by glacial processes, and has views of nearby mountains such as The Remarkables, Cecil Peak, Walter Peak and just above the town, Ben Lomond and Queenstown Hill. Queenstown has an urban population of 15,300, making it the 27th-largest urban area in New Zealand, and the third-largest urban area in Otago, behind Dunedin and Oamaru. The Queenstown-Lakes District has a land area of 8,704.97 square kilometres not counting its inland lakes (Lake Hāwea, Lake Wakatipu, and Lake Wanaka). The region has an estimated resident population of 39,100 (June 2018).",
        -56.416268,
        -57.638906,
        'https://www.google.com',
        now()
    );

# Create a POI 15
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
        'Santorini',
        'Santorini, officially Thira and classic Greek Thera, is an island in the southern Aegean Sea, about 200 km southeast of Greece. It is the largest island of a small, circular archipelago, which bears the same name and is the remnant of a volcanic caldera. It forms the southernmost member of the Cyclades group of islands, with an area of approximately 73 km2 and a 2011 census population of 15,550. The municipality of Santorini includes the inhabited islands of Santorini and Therasia and the uninhabited islands of Nea Kameni, Palaia Kameni, Aspronisi and Christiana. The total land area is 90.623 km2. Santorini is part of the Thira regional unit.',
        -30.877563,
        53.181778,
        'https://www.google.com',
        now()
    );

# Create a POI 16
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
        'Uluru',
        'Uluru, also known as Ayers Rock and officially gazetted as Uluru / Ayers Rock, is a large sandstone rock formation in the southern part of the Northern Territory in central Australia. It lies 335 km south west of the nearest large town, Alice Springs. Uluru is sacred to the Pitjantjatjara Anangu, the Aboriginal people of the area. The area around the formation is home to an abundance of springs, waterholes, rock caves and ancient paintings. Uluru is listed as a UNESCO World Heritage Site. Uluru and Kata Tjuta, also known as the Olgas, are the two major features of the Uluṟu-Kata Tjuṯa National Park. Uluru is one of Australia’s most recognisable natural landmarks. The sandstone formation stands 348 m high, rising 863 m above sea level with most of its bulk lying underground, and has a total circumference of 9.4 km. Both Uluru and the nearby Kata Tjuta formation have great cultural significance for the Aṉangu people, the traditional inhabitants of the area, who lead walking tours to inform visitors about the local flora and fauna, bush foods and the Aboriginal dreamtime stories of the area. Uluru is notable for appearing to change colour at different times of the day and year, most notably when it glows red at dawn and sunset.',
        -46.252772,
        38.675952,
        'https://www.google.com',
        now()
    );

# Create a POI 17
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
        'Victoria Falls',
        "Victoria Falls is a waterfall on the Zambezi River in southern Africa, which provides habitat for several unique species of plants and animals. It is located on the border between Zambia and Zimbabwe and is considered to be one of the world's largest waterfalls due to its width of 1,708 metres (5,604 ft). The Victoria Falls are 1,708 metres (5,604 ft) wide, making them the largest curtain of water in the world. They drop 108 metres (354 ft), into the Zambezi Gorge, creating the largest falling curtain of water in the world. The falls\' maximum flow rate compares well with that of other major waterfalls. The Zambezi is the fourth largest river in Africa, and it is the largest flowing into the Indian Ocean from Africa. Its annual flow is twice that of the Nile and almost four times that of the Tigris and Euphrates rivers combined, though it only has one-fifth the drainage area of the Nile. The Victoria Falls are formed as the full width of the river plummets in a single vertical drop into a transverse chasm 1708 metres (5604 ft) wide, carved by its waters along a fracture zone in the basalt plateau. The depth of the chasm, called the First Gorge, varies from 80 metres (260 ft) at its western end to 108 metres (354 ft) in the centre. The only outlet to the First Gorge is a 110-metre (360 ft) wide gap about two-thirds of the way across the width of the falls from the western end, through which the whole volume of the river pours into the Victoria Falls gorges. There are two islands on the crest of the falls that are large enough to divide the curtain of water even at full flood: Boaruka Island (or Cataract Island) near the western bank, and Livingstone Island near the middle—the point from which Livingstone first viewed the falls. At less than full flood, additional islets divide the curtain of water into separate parallel streams. The main streams are named, in order from Zimbabwe (west) to Zambia (east): Devil\'s Cataract (called Leaping Water by some), Main Falls, Rainbow Falls (the highest) and the Eastern Cataract.",
        -23.958889,
        35.621293,
        'https://www.google.com',
        now()
    );

# Create a POI 18
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
        'Wulingyuan',
        "Wulingyuan is a scenic and historical site in south-central China's Hunan Province. It was inscribed as a UNESCO World Heritage Site in 1992. It is noted for more than 3,000 quartzite sandstone pillars and peaks across most of the site, many over 200 metres (660 ft) in height, along with many ravines and gorges with attractive streams, pools, lakes, rivers and waterfalls. It features 40 caves, many with large calcite deposits, and two natural bridges, Xianrenqiao (Bridge of the Immortals) and Tianqiashengkong (Bridge Across the Sky).",
        -10.581447,
        -11.583915,
        'https://www.google.com',
        now()
    );

# Create a POI 19
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
        'Xochicalco',
        'Xochicalco is a pre-Columbian archaeological site in Miacatlán Municipality in the western part of the Mexican state of Morelos. The name Xochicalco may be translated from Nahuatl as "in the house of Flowers". The site is located 38 km southwest of Cuernavaca, about 76 miles by road from Mexico City. The site is open to visitors all week, from 10 am to 5 pm, although access to the observatory is only allowed after noon. The apogee of Xochicalco came after the fall of Teotihuacan and it has been speculated that Xochicalco may have played a part in the fall of the Teotihuacan empire. The architecture and iconography of Xochicalco show affinities with Teotihuacan, the Maya area, and the Matlatzinca culture of the Toluca Valley. Today the residents of the nearby village of Cuentepec speak Nahuatl.',
        -58.601833,
        -40.793144,
        'https://www.google.com',
        now()
    );

# Create a POI 20
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
        'Yosemite Valley',
        "Yosemite Valley is a glacial valley in Yosemite National Park in the western Sierra Nevada mountains of Central California. The valley is about 7.5 miles (12 km) long and approximately 3000–3500 feet deep, surrounded by high granite summits such as Half Dome and El Capitan, and densely forested with pines. The valley is drained by the Merced River, and a multitude of streams and waterfalls flow into it, including Tenaya, Illilouette, Yosemite and Bridalveil Creeks. Yosemite Falls is the highest waterfall in North America, and is a big attraction especially in the spring when the water flow is at its peak. The valley is renowned for its natural environment, and is regarded as the centerpiece of Yosemite National Park, attracting visitors from around the world. The Valley is the main attraction in the park for the majority of visitors, and a bustling hub of activity during tourist season in the summer months. Most visitors pass through the Tunnel View entrance. Visitor facilities are located in the center of the valley. There are both hiking trail loops that stay within the valley and trailheads that lead to higher elevations, all of which afford glimpses of the park's many scenic wonders. Yosemite Valley is located on the western slope of the Sierra Nevada mountains, 150 miles (240 km) due east of San Francisco. It stretches for 7.5 miles (12 km) in a roughly east-west direction, with an average width of about 1 mile (1.6 km). Yosemite Valley represents only one percent of the park area, but this is where most visitors arrive and stay. More than half a dozen creeks tumble from hanging valleys at the top of granite cliffs that can rise 3000–3500 feet (900–1050 m) above the valley floor, which itself is 4000 ft (1200 m) above sea level. These streams combine into the Merced River, which flows out from the western end of the valley, down the rest of its canyon to the San Joaquin Valley. The flat floor of Yosemite Valley holds both forest and large open meadows, which have views of the surrounding crests and waterfalls. The first view of Yosemite Valley many visitors see is the Tunnel View. So many paintings were made from a viewpoint nearby that the National Park Service named that viewpoint Artist Point. The view from the lower end of the Valley contains the great granite monolith El Cap",
        12.144457,
        17.813773,
        'https://www.google.com',
        now()
    );

# Create a tag
INSERT INTO
    tag (id, name, createdAt)
VALUES (uuid(), 'Kid friendly', now());

# Create a tag
INSERT INTO
    tag (id, name, createdAt)
VALUES (
        uuid(),
        'Panoramic view',
        now()
    );

# Create a tag
INSERT INTO
    tag (id, name, createdAt)
VALUES (
        uuid(),
        'Adapted for all',
        now()
    );

# Create a tag
INSERT INTO
    tag (id, name, createdAt)
VALUES (uuid(), 'Long', now());

# Create a tag
INSERT INTO
    tag (id, name, createdAt)
VALUES (uuid(), 'Difficult', now());

# Create a tag
INSERT INTO
    tag (id, name, createdAt)
VALUES (
        uuid(),
        'Vertigo inducing',
        now()
    );

# Create a photo 1
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '744894734496452482.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Forest tour'
            LIMIT 1
        )
    );

# Create a photo 2
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '462844585855573669.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Cliffside walk'
            LIMIT 1
        )
    );

# Create a photo 3
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '439347589783944678.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Seaside walk'
            LIMIT 1
        )
    );

# Create a photo 4
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '493223268769326658.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Frost encounter'
            LIMIT 1
        )
    );

# Create a photo 5
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '386379638246375885.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Lake tour'
            LIMIT 1
        )
    );

# Create a photo 6
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '327695942565622775.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Tour around the lake'
            LIMIT 1
        )
    );

# Create a photo 7
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '893832984798839872.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Tour around the city'
            LIMIT 1
        )
    );

# Create a photo 8
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '854552999763784488.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Mountain challenge'
            LIMIT 1
        )
    );

# Create a photo 9
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '875966564272772485.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Enjoy the river'
            LIMIT 1
        )
    );

# Create a photo 10
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '569535395574447549.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Desert discovery'
            LIMIT 1
        )
    );

# Create a photo 11
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '356748742699833879.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Countriside tour'
            LIMIT 1
        )
    );

# Create a photo 12
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '597438485686935349.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Desert encounter'
            LIMIT 1
        )
    );

# Create a photo 13
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '495454336644926798.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Coastal walk'
            LIMIT 1
        )
    );

# Create a photo 14
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '656358648255999577.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Mountain tour'
            LIMIT 1
        )
    );

# Create a photo 15
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '785765253523649558.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'River tour'
            LIMIT 1
        )
    );

# Create a photo 16
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '368627943484736575.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Tundra tour'
            LIMIT 1
        )
    );

# Create a photo 17
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '569294497977564738.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Desert discovery tour'
            LIMIT 1
        )
    );

# Create a photo 18
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '584536835328886628.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'walk along the seaside'
            LIMIT 1
        )
    );

# Create a photo 19
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '955356688686235523.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'City discovery'
            LIMIT 1
        )
    );

# Create a photo 20
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '829954287722848242.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Monument tour'
            LIMIT 1
        )
    );

# Create a photo 21
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '342366897644922537.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Lake visit'
            LIMIT 1
        )
    );

# Create a photo 22
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '864686665345442872.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Riverside walk'
            LIMIT 1
        )
    );

# Create a photo 23
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '339967685294588938.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Village tour'
            LIMIT 1
        )
    );

# Create a photo 24
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '476423655569875538.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Mountain climb'
            LIMIT 1
        )
    );

# Create a photo 25
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '734254735678963584.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'A walk in the plains'
            LIMIT 1
        )
    );

# Create a photo 26
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '778295974783382493.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Maritime walk'
            LIMIT 1
        )
    );

# Create a photo 27
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '862838983844332482.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Sightseeing tour'
            LIMIT 1
        )
    );

# Create a photo 28
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '739737885686835338.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Forest hike'
            LIMIT 1
        )
    );

# Create a photo 29
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '878923736874449334.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Around the lake'
            LIMIT 1
        )
    );

# Create a photo 30
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '696953777365458366.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Cliffside hike'
            LIMIT 1
        )
    );

# Create a photo 31
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '247763739693758433.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Walk next to the lake'
            LIMIT 1
        )
    );

# Create a photo 32
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '745475529322994764.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'To the top'
            LIMIT 1
        )
    );

# Create a photo 33
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '582858487459629257.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Hot walk'
            LIMIT 1
        )
    );

# Create a photo 34
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '347587498663938336.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Cold walk'
            LIMIT 1
        )
    );

# Create a photo 35
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '267968948435532846.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Track the wildlife'
            LIMIT 1
        )
    );

# Create a photo 36
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '444675635858277257.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Tree walk'
            LIMIT 1
        )
    );

# Create a photo 37
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '833487959876644485.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Arid walk'
            LIMIT 1
        )
    );

# Create a photo 38
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '535252859273238973.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Maritime escape'
            LIMIT 1
        )
    );

# Create a photo 39 
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '255292963345862785.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Hike along the lake'
            LIMIT 1
        )
    );

# Create a photo 40
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '887562936273676744.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Wild walk'
            LIMIT 1
        )
    );

# Create a photo 41
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '897243982562434865.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Cold hike'
            LIMIT 1
        )
    );

# Create a photo 42
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '792997894727869757.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Challenging the mountain'
            LIMIT 1
        )
    );

# Create a photo 43
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '697642379885554562.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'River challenge'
            LIMIT 1
        )
    );

# Create a photo 44
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '243576665235436668.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Beach walk'
            LIMIT 1
        )
    );

# Create a photo 45
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '946659239732856268.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Simple sightseeing tour'
            LIMIT 1
        )
    );

# Create a photo 46
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '356344824498467347.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Village escape'
            LIMIT 1
        )
    );

# Create a photo 47
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '925283537346384356.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Monument discovery hike'
            LIMIT 1
        )
    );

# Create a photo 48
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '829828969729767945.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Maritime hike'
            LIMIT 1
        )
    );

# Create a photo 49
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '256469623687725899.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Field view'
            LIMIT 1
        )
    );

# Create a photo 50
INSERT INTO
    photo (id, filename, createdAt, hikeId)
VALUES (
        uuid(),
        '245976243972296735.jpg',
        now(), (
            SELECT id
            FROM hike
            WHERE
                name = 'Stump walk'
            LIMIT 1
        )
    );

# Create a POI photo 1
INSERT INTO
    photo (
        id,
        filename,
        createdAt,
        pointOfInterestId
    )
VALUES (
        uuid(),
        '144794893907337484.jpg',
        now(), (
            SELECT id
            FROM
                pointOfInterest
            WHERE
                name = 'Eiffel Tower'
            LIMIT 1
        )
    );

# Create a POI photo 2
INSERT INTO
    photo (
        id,
        filename,
        createdAt,
        pointOfInterestId
    )
VALUES (
        uuid(),
        '926856814601945141.jpg',
        now(), (
            SELECT id
            FROM
                pointOfInterest
            WHERE
                name = 'Versailles Castle'
            LIMIT 1
        )
    );

# Create a POI photo 3
INSERT INTO
    photo (
        id,
        filename,
        createdAt,
        pointOfInterestId
    )
VALUES (
        uuid(),
        '690426984358000466.jpg',
        now(), (
            SELECT id
            FROM
                pointOfInterest
            WHERE
                name = 'Giza Pyramid'
            LIMIT 1
        )
    );

# Create a POI photo 4
INSERT INTO
    photo (
        id,
        filename,
        createdAt,
        pointOfInterestId
    )
VALUES (
        uuid(),
        '415285997759469376.jpg',
        now(), (
            SELECT id
            FROM
                pointOfInterest
            WHERE
                name = 'Notre Dame de Paris'
            LIMIT 1
        )
    );

# Create a POI photo 5
INSERT INTO
    photo (
        id,
        filename,
        createdAt,
        pointOfInterestId
    )
VALUES (
        uuid(),
        '416418509734970490.jpg',
        now(), (
            SELECT id
            FROM
                pointOfInterest
            WHERE
                name = 'Rome Colosseum'
            LIMIT 1
        )
    );

# Create a POI photo 5.5
INSERT INTO
    photo (
        id,
        filename,
        createdAt,
        pointOfInterestId
    )
VALUES (
        uuid(),
        '546074397856518841.jpg',
        now(), (
            SELECT id
            FROM
                pointOfInterest
            WHERE
                name = 'Stonehenge'
            LIMIT 1
        )
    );

# Create a POI photo 6
INSERT INTO
    photo (
        id,
        filename,
        createdAt,
        pointOfInterestId
    )
VALUES (
        uuid(),
        '840099761829064236.jpg',
        now(), (
            SELECT id
            FROM
                pointOfInterest
            WHERE
                name = 'Athens Acropolis'
            LIMIT 1
        )
    );

# Create a POI photo 7
INSERT INTO
    photo (
        id,
        filename,
        createdAt,
        pointOfInterestId
    )
VALUES (
        uuid(),
        '861352917287701077.jpg',
        now(), (
            SELECT id
            FROM
                pointOfInterest
            WHERE
                name = 'Berlin Wall'
            LIMIT 1
        )
    );

# Create a POI photo 8
INSERT INTO
    photo (
        id,
        filename,
        createdAt,
        pointOfInterestId
    )
VALUES (
        uuid(),
        '431943025840855510.jpg',
        now(), (
            SELECT id
            FROM
                pointOfInterest
            WHERE
                name = 'Cologne Cathedral'
            LIMIT 1
        )
    );

# Create a POI photo 9
INSERT INTO
    photo (
        id,
        filename,
        createdAt,
        pointOfInterestId
    )
VALUES (
        uuid(),
        '469143716816500321.jpg',
        now(), (
            SELECT id
            FROM
                pointOfInterest
            WHERE
                name = 'Kremlin'
            LIMIT 1
        )
    );

# Create a POI photo 10
INSERT INTO
    photo (
        id,
        filename,
        createdAt,
        pointOfInterestId
    )
VALUES (
        uuid(),
        '844164430923157296.jpg',
        now(), (
            SELECT id
            FROM
                pointOfInterest
            WHERE
                name = 'London Tower'
            LIMIT 1
        )
    );

# Create a POI photo 11
INSERT INTO
    photo (
        id,
        filename,
        createdAt,
        pointOfInterestId
    )
VALUES (
        uuid(),
        '928179396738991169.jpg',
        now(), (
            SELECT id
            FROM
                pointOfInterest
            WHERE
                name = 'Machu Picchu'
            LIMIT 1
        )
    );

# Create a POI photo 12
INSERT INTO
    photo (
        id,
        filename,
        createdAt,
        pointOfInterestId
    )
VALUES (
        uuid(),
        '108570766346930020.jpg',
        now(), (
            SELECT id
            FROM
                pointOfInterest
            WHERE
                name = 'Neuschwanstein Castle'
            LIMIT 1
        )
    );

# Create a POI photo 13
INSERT INTO
    photo (
        id,
        filename,
        createdAt,
        pointOfInterestId
    )
VALUES (
        uuid(),
        '709333308448938222.jpg',
        now(), (
            SELECT id
            FROM
                pointOfInterest
            WHERE
                name = 'Pompeii'
            LIMIT 1
        )
    );

# Create a POI photo 14
INSERT INTO
    photo (
        id,
        filename,
        createdAt,
        pointOfInterestId
    )
VALUES (
        uuid(),
        '807783664983953504.jpg',
        now(), (
            SELECT id
            FROM
                pointOfInterest
            WHERE
                name = 'Queenstown'
            LIMIT 1
        )
    );

# Create a POI photo 15
INSERT INTO
    photo (
        id,
        filename,
        createdAt,
        pointOfInterestId
    )
VALUES (
        uuid(),
        '508847625466426744.jpg',
        now(), (
            SELECT id
            FROM
                pointOfInterest
            WHERE
                name = 'Santorini'
            LIMIT 1
        )
    );

# Create a POI photo 16
INSERT INTO
    photo (
        id,
        filename,
        createdAt,
        pointOfInterestId
    )
VALUES (
        uuid(),
        '836914020933285990.jpg',
        now(), (
            SELECT id
            FROM
                pointOfInterest
            WHERE
                name = 'Uluru'
            LIMIT 1
        )
    );

# Create a POI photo 17
INSERT INTO
    photo (
        id,
        filename,
        createdAt,
        pointOfInterestId
    )
VALUES (
        uuid(),
        '151486993157183808.jpg',
        now(), (
            SELECT id
            FROM
                pointOfInterest
            WHERE
                name = 'Victoria Falls'
            LIMIT 1
        )
    );

# Create a POI photo 18
INSERT INTO
    photo (
        id,
        filename,
        createdAt,
        pointOfInterestId
    )
VALUES (
        uuid(),
        '792840518037547177.jpg',
        now(), (
            SELECT id
            FROM
                pointOfInterest
            WHERE
                name = 'Wulingyuan'
            LIMIT 1
        )
    );

# Create a POI photo 19
INSERT INTO
    photo (
        id,
        filename,
        createdAt,
        pointOfInterestId
    )
VALUES (
        uuid(),
        '216545613311848687.jpg',
        now(), (
            SELECT id
            FROM
                pointOfInterest
            WHERE
                name = 'Xochicalco'
            LIMIT 1
        )
    );

# Create a POI photo 20
INSERT INTO
    photo (
        id,
        filename,
        createdAt,
        pointOfInterestId
    )
VALUES (
        uuid(),
        '268666491944659218.jpg',
        now(), (
            SELECT id
            FROM
                pointOfInterest
            WHERE
                name = 'Yosemite Valley'
            LIMIT 1
        )
    );

# Create a user photo 1
INSERT INTO
    photo (id, filename, createdAt, userId)
VALUES (
        uuid(),
        '302611691068325888.jpg',
        now(), (
            SELECT id
            FROM user
            WHERE
                pseudo = 'user'
            LIMIT 1
        )
    );

# Create a user photo 2
INSERT INTO
    photo (id, filename, createdAt, userId)
VALUES (
        uuid(),
        '134782487109673590.jpg',
        now(), (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Mike'
            LIMIT 1
        )
    );

# Create a user photo 3
INSERT INTO
    photo (id, filename, createdAt, userId)
VALUES (
        uuid(),
        '214708671931353630.jpg',
        now(), (
            SELECT id
            FROM user
            WHERE
                pseudo = 'James'
            LIMIT 1
        )
    );

# Create a user photo 4
INSERT INTO
    photo (id, filename, createdAt, userId)
VALUES (
        uuid(),
        '413361425002851919.jpg',
        now(), (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Lea'
            LIMIT 1
        )
    );

# Create a user photo 5
INSERT INTO
    photo (id, filename, createdAt, userId)
VALUES (
        uuid(),
        '801280027120838386.jpg',
        now(), (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Tom'
            LIMIT 1
        )
    );

# Create a user photo 6
INSERT INTO
    photo (id, filename, createdAt, userId)
VALUES (
        uuid(),
        '551766841973454630.jpg',
        now(), (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Jeanne'
            LIMIT 1
        )
    );

# Create a photo for a category 1
INSERT INTO
    photo (
        id,
        filename,
        createdAt,
        categoryId
    )
VALUES (
        uuid(),
        '368163037142015887.jpg',
        now(), (
            SELECT id
            FROM category
            WHERE
                name = 'Desert'
            LIMIT 1
        )
    );

# Create a photo for a category 2
INSERT INTO
    photo (
        id,
        filename,
        createdAt,
        categoryId
    )
VALUES (
        uuid(),
        '568870428205310933.jpg',
        now(), (
            SELECT id
            FROM category
            WHERE
                name = 'Plains'
            LIMIT 1
        )
    );

# Create a photo for a category 3
INSERT INTO
    photo (
        id,
        filename,
        createdAt,
        categoryId
    )
VALUES (
        uuid(),
        '020877867899926677.jpg',
        now(), (
            SELECT id
            FROM category
            WHERE
                name = 'Seaside'
            LIMIT 1
        )
    );

# Create a photo for a category 4
INSERT INTO
    photo (
        id,
        filename,
        createdAt,
        categoryId
    )
VALUES (
        uuid(),
        '563132284196062604.jpg',
        now(), (
            SELECT id
            FROM category
            WHERE name = 'Lake'
            LIMIT 1
        )
    );

# Create a photo for a category 5
INSERT INTO
    photo (
        id,
        filename,
        createdAt,
        categoryId
    )
VALUES (
        uuid(),
        '869004116490588152.jpg',
        now(), (
            SELECT id
            FROM category
            WHERE
                name = 'Riverside'
            LIMIT 1
        )
    );

# Create a photo for a category 6
INSERT INTO
    photo (
        id,
        filename,
        createdAt,
        categoryId
    )
VALUES (
        uuid(),
        '725502732988947148.jpg',
        now(), (
            SELECT id
            FROM category
            WHERE
                name = 'Mountains'
            LIMIT 1
        )
    );

# Create a photo for a category 7
INSERT INTO
    photo (
        id,
        filename,
        createdAt,
        categoryId
    )
VALUES (
        uuid(),
        '911596630893486983.jpg',
        now(), (
            SELECT id
            FROM category
            WHERE name = 'City'
            LIMIT 1
        )
    );

# Create a photo for a category 8
INSERT INTO
    photo (
        id,
        filename,
        createdAt,
        categoryId
    )
VALUES (
        uuid(),
        '994214302560108534.jpg',
        now(), (
            SELECT id
            FROM category
            WHERE
                name = 'Tundra'
            LIMIT 1
        )
    );

# Create a photo for a category 9
INSERT INTO
    photo (
        id,
        filename,
        createdAt,
        categoryId
    )
VALUES (
        uuid(),
        '982214819421726397.jpg',
        now(), (
            SELECT id
            FROM category
            WHERE
                name = 'Forest'
            LIMIT 1
        )
    );

# Add a tag to a hike 1
INSERT INTO
    hikes_tags (hikeId, tagId)
VALUES ( (
            SELECT id
            FROM hike
            WHERE
                name = 'Forest tour'
            LIMIT 1
        ), (
            SELECT id
            FROM tag
            WHERE
                name = 'Kid friendly'
            LIMIT 1
        )
    );

# Add a tag to a hike 2
INSERT INTO
    hikes_tags (hikeId, tagId)
VALUES ( (
            SELECT id
            FROM hike
            WHERE
                name = 'Forest tour'
            LIMIT 1
        ), (
            SELECT id
            FROM tag
            WHERE
                name = 'Adapted for all'
            LIMIT 1
        )
    );

# Add a tag to a hike 3
INSERT INTO
    hikes_tags (hikeId, tagId)
VALUES ( (
            SELECT id
            FROM hike
            WHERE
                name = 'Cliffside walk'
            LIMIT 1
        ), (
            SELECT id
            FROM tag
            WHERE
                name = 'Vertigo inducing'
            LIMIT 1
        )
    );

# Add a tag to a hike 4
INSERT INTO
    hikes_tags (hikeId, tagId)
VALUES ( (
            SELECT id
            FROM hike
            WHERE
                name = 'Seaside walk'
            LIMIT 1
        ), (
            SELECT id
            FROM tag
            WHERE name = 'Long'
            LIMIT 1
        )
    );

# Add a tag to a hike 5
INSERT INTO
    hikes_tags (hikeId, tagId)
VALUES ( (
            SELECT id
            FROM hike
            WHERE
                name = 'Frost encounter'
            LIMIT 1
        ), (
            SELECT id
            FROM tag
            WHERE
                name = 'Difficult'
            LIMIT 1
        )
    );

# Add a tag to a hike 6
INSERT INTO
    hikes_tags (hikeId, tagId)
VALUES ( (
            SELECT id
            FROM hike
            WHERE
                name = 'Frost encounter'
            LIMIT 1
        ), (
            SELECT id
            FROM tag
            WHERE name = 'Long'
            LIMIT 1
        )
    );

# Add a tag to a hike 7
INSERT INTO
    hikes_tags (hikeId, tagId)
VALUES ( (
            SELECT id
            FROM hike
            WHERE
                name = 'Lake tour'
            LIMIT 1
        ), (
            SELECT id
            FROM tag
            WHERE
                name = 'Panoramic view'
            LIMIT 1
        )
    );

# Add a tag to a hike 8
INSERT INTO
    hikes_tags (hikeId, tagId)
VALUES ( (
            SELECT id
            FROM hike
            WHERE
                name = 'Tour around the lake'
            LIMIT 1
        ), (
            SELECT id
            FROM tag
            WHERE
                name = 'Adapted for all'
            LIMIT 1
        )
    );

# Add a tag to a hike 9
INSERT INTO
    hikes_tags (hikeId, tagId)
VALUES ( (
            SELECT id
            FROM hike
            WHERE
                name = 'Tour around the city'
            LIMIT 1
        ), (
            SELECT id
            FROM tag
            WHERE
                name = 'Kid friendly'
            LIMIT 1
        )
    );

# Add a tag to a hike 10
INSERT INTO
    hikes_tags (hikeId, tagId)
VALUES ( (
            SELECT id
            FROM hike
            WHERE
                name = 'Mountain challenge'
            LIMIT 1
        ), (
            SELECT id
            FROM tag
            WHERE
                name = 'Difficult'
            LIMIT 1
        )
    );

# Add a tag to a hike 11
INSERT INTO
    hikes_tags (hikeId, tagId)
VALUES ( (
            SELECT id
            FROM hike
            WHERE
                name = 'Desert discovery'
            LIMIT 1
        ), (
            SELECT id
            FROM tag
            WHERE
                name = 'Panoramic view'
            LIMIT 1
        )
    );

# Add a tag to a hike 12
INSERT INTO
    hikes_tags (hikeId, tagId)
VALUES ( (
            SELECT id
            FROM hike
            WHERE
                name = 'Riverside walk'
            LIMIT 1
        ), (
            SELECT id
            FROM tag
            WHERE name = 'Long'
            LIMIT 1
        )
    );

# Add a tag to a hike 13
INSERT INTO
    hikes_tags (hikeId, tagId)
VALUES ( (
            SELECT id
            FROM hike
            WHERE
                name = 'Mountain climb'
            LIMIT 1
        ), (
            SELECT id
            FROM tag
            WHERE
                name = 'Difficult'
            LIMIT 1
        )
    );

# Add a tag to a hike 14
INSERT INTO
    hikes_tags (hikeId, tagId)
VALUES ( (
            SELECT id
            FROM hike
            WHERE
                name = 'Mountain climb'
            LIMIT 1
        ), (
            SELECT id
            FROM tag
            WHERE
                name = 'Vertigo inducing'
            LIMIT 1
        )
    );

# Add a tag to a hike 15
INSERT INTO
    hikes_tags (hikeId, tagId)
VALUES ( (
            SELECT id
            FROM hike
            WHERE
                name = 'Forest hike'
            LIMIT 1
        ), (
            SELECT id
            FROM tag
            WHERE name = 'Long'
            LIMIT 1
        )
    );

# Add a tag to a hike 16
INSERT INTO
    hikes_tags (hikeId, tagId)
VALUES ( (
            SELECT id
            FROM hike
            WHERE
                name = 'Around the lake'
            LIMIT 1
        ), (
            SELECT id
            FROM tag
            WHERE
                name = 'Panoramic view'
            LIMIT 1
        )
    );

# Add a tag to a hike 17
INSERT INTO
    hikes_tags (hikeId, tagId)
VALUES ( (
            SELECT id
            FROM hike
            WHERE
                name = 'Cliffside hike'
            LIMIT 1
        ), (
            SELECT id
            FROM tag
            WHERE
                name = 'Vertigo inducing'
            LIMIT 1
        )
    );

# Add a tag to a hike 18
INSERT INTO
    hikes_tags (hikeId, tagId)
VALUES ( (
            SELECT id
            FROM hike
            WHERE
                name = 'Cliffside hike'
            LIMIT 1
        ), (
            SELECT id
            FROM tag
            WHERE name = 'Long'
            LIMIT 1
        )
    );

# Add a tag to a hike 19
INSERT INTO
    hikes_tags (hikeId, tagId)
VALUES ( (
            SELECT id
            FROM hike
            WHERE
                name = 'Cold hike'
            LIMIT 1
        ), (
            SELECT id
            FROM tag
            WHERE name = 'Long'
            LIMIT 1
        )
    );

# Add a tag to a hike 20
INSERT INTO
    hikes_tags (hikeId, tagId)
VALUES ( (
            SELECT id
            FROM hike
            WHERE
                name = 'Challenging the mountain'
            LIMIT 1
        ), (
            SELECT id
            FROM tag
            WHERE
                name = 'Vertigo inducing'
            LIMIT 1
        )
    );

# Add a tag to a hike 21
INSERT INTO
    hikes_tags (hikeId, tagId)
VALUES ( (
            SELECT id
            FROM hike
            WHERE
                name = 'Challenging the mountain'
            LIMIT 1
        ), (
            SELECT id
            FROM tag
            WHERE
                name = 'Difficult'
            LIMIT 1
        )
    );

# Add a tag to a hike 22
INSERT INTO
    hikes_tags (hikeId, tagId)
VALUES ( (
            SELECT id
            FROM hike
            WHERE
                name = 'Challenging the mountain'
            LIMIT 1
        ), (
            SELECT id
            FROM tag
            WHERE name = 'Long'
            LIMIT 1
        )
    );

# Add a tag to a hike 23
INSERT INTO
    hikes_tags (hikeId, tagId)
VALUES ( (
            SELECT id
            FROM hike
            WHERE
                name = 'Challenging the mountain'
            LIMIT 1
        ), (
            SELECT id
            FROM tag
            WHERE
                name = 'Kid friendly'
            LIMIT 1
        )
    );

# Add a tag to a hike 24
INSERT INTO
    hikes_tags (hikeId, tagId)
VALUES ( (
            SELECT id
            FROM hike
            WHERE
                name = 'River challenge'
            LIMIT 1
        ), (
            SELECT id
            FROM tag
            WHERE name = 'Long'
            LIMIT 1
        )
    );

# Add a tag to a hike 25
INSERT INTO
    hikes_tags (hikeId, tagId)
VALUES ( (
            SELECT id
            FROM hike
            WHERE
                name = 'Simple sightseeing tour'
            LIMIT 1
        ), (
            SELECT id
            FROM tag
            WHERE name = 'Long'
            LIMIT 1
        )
    );

# Add a tag to a hike 26
INSERT INTO
    hikes_tags (hikeId, tagId)
VALUES ( (
            SELECT id
            FROM hike
            WHERE
                name = 'Stump walk'
            LIMIT 1
        ), (
            SELECT id
            FROM tag
            WHERE
                name = 'Panoramic view'
            LIMIT 1
        )
    );

# Add a tag to a hike 27
INSERT INTO
    hikes_tags (hikeId, tagId)
VALUES ( (
            SELECT id
            FROM hike
            WHERE
                name = 'Field view'
            LIMIT 1
        ), (
            SELECT id
            FROM tag
            WHERE
                name = 'Kid friendly'
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
                pseudo = 'Mike'
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
                pseudo = 'James'
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
                pseudo = 'James'
            LIMIT 1
        ), (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Mike'
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
                pseudo = 'Lea'
            LIMIT 1
        ), (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Tom'
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
                pseudo = 'Tom'
            LIMIT 1
        ), (
            SELECT id
            FROM user
            WHERE
                pseudo = 'Jeanne'
            LIMIT 1
        )
    );

# Add a POI to a hike 1
INSERT INTO
    hikes_pointsOfInterest (hikeId, pointOfInterestId)
VALUES ( (
            SELECT id
            FROM hike
            WHERE
                name = 'Cliffside walk'
            LIMIT 1
        ), (
            SELECT id
            FROM
                pointOfInterest
            WHERE
                name = 'Eiffel Tower'
            LIMIT 1
        )
    );

# Add a POI to a hike 2
INSERT INTO
    hikes_pointsOfInterest (hikeId, pointOfInterestId)
VALUES ( (
            SELECT id
            FROM hike
            WHERE
                name = 'Cliffside walk'
            LIMIT 1
        ), (
            SELECT id
            FROM
                pointOfInterest
            WHERE
                name = 'Versailles Castle'
            LIMIT 1
        )
    );

# Add a POI to a hike 3
INSERT INTO
    hikes_pointsOfInterest (hikeId, pointOfInterestId)
VALUES ( (
            SELECT id
            FROM hike
            WHERE
                name = 'Frost encounter'
            LIMIT 1
        ), (
            SELECT id
            FROM
                pointOfInterest
            WHERE
                name = 'Giza Pyramid'
            LIMIT 1
        )
    );

# Add a POI to a hike 4
INSERT INTO
    hikes_pointsOfInterest (hikeId, pointOfInterestId)
VALUES ( (
            SELECT id
            FROM hike
            WHERE
                name = 'Frost encounter'
            LIMIT 1
        ), (
            SELECT id
            FROM
                pointOfInterest
            WHERE
                name = 'Stonehenge'
            LIMIT 1
        )
    );

# Add a POI to a hike 5
INSERT INTO
    hikes_pointsOfInterest (hikeId, pointOfInterestId)
VALUES ( (
            SELECT id
            FROM hike
            WHERE
                name = 'Seaside walk'
            LIMIT 1
        ), (
            SELECT id
            FROM
                pointOfInterest
            WHERE
                name = 'Notre Dame de Paris'
            LIMIT 1
        )
    );

# Add a POI to a hike 6
INSERT INTO
    hikes_pointsOfInterest (hikeId, pointOfInterestId)
VALUES ( (
            SELECT id
            FROM hike
            WHERE
                name = 'Seaside walk'
            LIMIT 1
        ), (
            SELECT id
            FROM
                pointOfInterest
            WHERE
                name = 'Rome Colosseum'
            LIMIT 1
        )
    );

# Add a POI to a hike 7
INSERT INTO
    hikes_pointsOfInterest (hikeId, pointOfInterestId)
VALUES ( (
            SELECT id
            FROM hike
            WHERE
                name = 'Tour around the lake'
            LIMIT 1
        ), (
            SELECT id
            FROM
                pointOfInterest
            WHERE
                name = 'Rome Colosseum'
            LIMIT 1
        )
    );

# Add a POI to a hike 8
INSERT INTO
    hikes_pointsOfInterest (hikeId, pointOfInterestId)
VALUES ( (
            SELECT id
            FROM hike
            WHERE
                name = 'Tour around the city'
            LIMIT 1
        ), (
            SELECT id