import api from '../../api';

export const convertApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsdConversion: builder.query({
      query: ({ date }) => {
        return `/currency-api@${date}/v1/currencies/usd.json`;
      },
    }),
  }),
});

// We can use the Lazy Query as well for GET requests depends on our Requirements.
// For POST request we will use mutations.
export const { useGetUsdConversionQuery } = convertApi;
