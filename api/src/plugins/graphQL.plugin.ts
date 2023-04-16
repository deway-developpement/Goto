// This plugin is used to set the HTTP status code to 401 when the user is not authorized so that the client can handle the error
const setHttpPlugin = {
    async requestDidStart() {
        return {
            async willSendResponse({ response }) {
                if (response?.errors?.[0]?.message === 'Unauthorized') {
                    response.http.status = 401;
                }
            },
        };
    },
};

export { setHttpPlugin };
