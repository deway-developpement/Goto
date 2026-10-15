// Runs inside the isolated test container. Never prints test JWTs or passwords.
const assert = require('node:assert/strict');
const email = 'container-smoke@example.test';
const password = 'local-smoke-test-password';
async function request(path, body, token) {
    const response = await fetch(`http://127.0.0.1:3000${path}`, {
        method: body ? 'POST' : 'GET',
        headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
        ...(body ? { body: JSON.stringify(body) } : {}),
    });
    assert(response.ok, `${path}: HTTP ${response.status}`);
    return response.json();
}
(async () => {
    const basic = await request('/graphql', { query: '{ __typename }' });
    assert.equal(basic.data?.__typename, 'Query');
    if (process.argv[2] !== 'verify') {
        const created = await request('/graphql', {
            query: 'mutation($input: UserInput!) { createUser(input: $input) { id } }',
            variables: { input: { pseudo: 'smoketest', email, password } },
        });
        assert(created.data?.createUser?.id, 'GraphQL user creation failed');
    }
    const session = await request('/auth/login', { email, password });
    assert(session.access_token && session.refresh_token, 'Login did not issue tokens');
    const profile = await request('/profile', null, session.access_token);
    assert.equal(profile.email, email);
    console.log(process.argv[2] === 'verify' ? 'API: user persists after restart; login/profile passed.' : 'API: GraphQL, user creation, bcrypt, login and JWT profile passed.');
})().catch(error => { console.error(error.message); process.exit(1); });
