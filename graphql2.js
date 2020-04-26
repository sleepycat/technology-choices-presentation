const express = require('express')
const graphqlHTTP = require('express-graphql')
const {
  GraphQLSchema,
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLInt,
} = require('graphql')

const WIDGET = new GraphQLEnumType({
  name: 'WIDGET',
  values: {
    RED_WIDGET: { value: 'red-widget' },
    GREEN_WIDGET: { value: 'green-widget' },
    BLUE_WIDGET: { value: 'blue-widget' },
  },
})

const query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    widgets: {
      type: GraphQLString,
      args: {
        name: {
          description: 'The id of the widget',
          type: new GraphQLNonNull(WIDGET),
        },
      },
      resolve: (source, { name }) => {
        return `select * from widgets where name = '${name}';`
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
