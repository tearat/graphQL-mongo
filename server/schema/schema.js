const graphql = require('graphql');

const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLID, 
    GraphQLInt, 
    GraphQLList, 
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLBoolean
} = graphql;

const Movie = require('../models/movie')
const Director = require('../models/director');
const director = require('../models/director');

// const movies = [
//     { id: 1, name: 'Film 1', genre: 'Genre 1', directorId: 1 },
//     { id: 2, name: 'Film 2', genre: 'Genre 2', directorId: 1 },
//     { id: 3, name: 'Film 3', genre: 'Genre 3', directorId: 1 },
//     { id: 4, name: 'Film 4', genre: 'Genre 4', directorId: 4 },
// ]

// const directors = [
//     { id: 1, name: 'Director 1', age: 11 },
//     { id: 2, name: 'Director 2', age: 22 },
//     { id: 3, name: 'Director 3', age: 33 },
//     { id: 4, name: 'Director 4', age: 44 },
// ]

const MovieType = new GraphQLObjectType({
    name: 'Movie',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        watched: { type: new GraphQLNonNull(GraphQLBoolean) },
        rate: { type: GraphQLInt },
        director: {
            type: DirectorType,
            resolve(parent, args) {
                // return directors.find(director => director.id == parent.directorId)
                return Director.findById(parent.directorId)
            }
        }
    })
})

const DirectorType = new GraphQLObjectType({
    name: 'Director',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        movies: {
            type: new GraphQLList(MovieType),
            resolve(parent, args) {
                // return movies.filter(movie => movie.directorId == parent.id)
                return Movie.find( { directorId: parent.id } )
            }
        }
    })
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addDirector: {
            type: DirectorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args) {
                const director = new Director({
                    name: args.name,
                    age: args.age
                })
                return director.save()
            }
        },
        addMovie: {
            type: MovieType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                watched: { type: new GraphQLNonNull(GraphQLBoolean) },
                rate: { type: GraphQLInt },
                directorId: { type: GraphQLID },
            },
            resolve(parent, args) {
                const movie = new Movie({
                    name: args.name,
                    genre: args.genre,
                    directorId: args.directorId,
                    rate: args.rate,
                    watched: args.watched,
                })
                return movie.save()
            }
        },
        updateDirector: {
            type: DirectorType,
            args: {
                id: { type: GraphQLID },
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve(parent, args) {
                return Director.findByIdAndUpdate(
                    args.id,
                    { $set: { name: args.name, age: args.age } },
                    { new: true }
                )
            }
        },
        updateMovie: {
            type: MovieType,
            args: {
                id: { type: GraphQLID },
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                watched: { type: new GraphQLNonNull(GraphQLBoolean) },
                rate: { type: GraphQLInt },
                directorId: { type: GraphQLID },
            },
            resolve(parent, args) {
                return Movie.findByIdAndUpdate(
                    args.id,
                    { $set: { 
                        name: args.name, 
                        genre: args.genre, 
                        directorId: args.directorId,
                        rate: args.rate,
                        watched: args.watched
                    } },
                    { new: true }
                )
            }
        },
        deleteDirector: {
            type: DirectorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Director.findByIdAndDelete(args.id)
            }
        },
        deleteMovie: {
            type: MovieType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Movie.findByIdAndDelete(args.id)
            }
        },
    }
})

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        movie: {
            type: MovieType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // return movies.find(movie => movie.id == args.id)
                return Movie.findById(args.id)
            }
        },
        director: {
            type: DirectorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // return directors.find(director => director.id == args.id)
                return Director.findById(args.id)
            }
        },
        movies: {
            type: new GraphQLList(MovieType),
            resolve(parent, args) {
                // return movies
                return Movie.find({})
            }
        },
        directors: {
            type: new GraphQLList(DirectorType),
            resolve(parent, args) {
                // return directors
                return Director.find({})
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation
})