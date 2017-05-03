export const state = {
    selected: 1,
    postalCodes: []
};

export const mutations = {
    setPostalCodes(state, postalCodes) {
        state.postalCodes = postalCodes;
    }
};