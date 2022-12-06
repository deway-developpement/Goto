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
