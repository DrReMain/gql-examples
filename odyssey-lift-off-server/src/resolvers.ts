import {Resolvers} from "./types"

export const resolvers: Resolvers = {
    Query: {
        tracksForHome: (parent, args, ctx) => {
            return ctx.dataSources.trackAPI.getTracksForHome();
        },

        track: (parent, args, ctx) => {
            return ctx.dataSources.trackAPI.getTrack(args.id);
        },

        module: (parent, args, ctx) => {
            return ctx.dataSources.trackAPI.getModule(args.id);
        }
    },

    Mutation: {
        incrementTrackViews: async (parent, args, ctx) => {
            try {
                const track = await ctx.dataSources.trackAPI.incrementTrackViews(args.id);
                return {
                    code: 200,
                    success: true,
                    message: `Successfully incremented number of views for track ${args.id}`,
                    track
                }
            } catch (err: any) {
                return {
                    code: err.extensions.response.status,
                    success: false,
                    message: err.extensions.response.body,
                    track: null
                }
            }
        }
    },

    Track: {
        author: (parent, args, ctx) => {
            return ctx.dataSources.trackAPI.getAuthor(parent.authorId);
        },

        modules: (parent, args, ctx) => {
            return ctx.dataSources.trackAPI.getTrackModules(parent.id);
        }
    }
}
