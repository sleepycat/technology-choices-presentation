const express = require('express')
const graphqlHTTP = require('express-graphql')
const { GraphQLSchema, GraphQLString, GraphQLObjectType, GraphQLNonNull, GraphQLInt, } = require('graphql')

const query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    widgets: {
      type: GraphQLString,
      args: {
        id: {
          description: 'The id of the widget',
          type: new GraphQLNonNull(GraphQLInt),
        },
      },
      resolve: (source, { id }) => {
        return `select * from widgets where name = '${id}';`
      },
    },
  }),
})

let server = express()

server.use(
  '/',
  graphqlHTTP({ schema: new GraphQLSchema({ query }), graphiql: true }),
)

server.listen(3000)
