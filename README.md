# Tech choices

This is a presentation for the report a cybercrime team.

## Code examples

First ensure that [Node.js](https://nodejs.org/en/) is installed on your system and the dependencies  for the demos by running the command `npm install` in the directory where all the presentation files are. My explanatory code also makes use of [curl](https://curl.haxx.se/), [jq](https://stedolan.github.io/jq/download/) and [prettier](https://prettier.io/).

	
### Cross Site Scripting (aka XSS)

```sh
npm run xss
```
In another terminal run

```sh
curl -s "localhost:3000/?name=<script>alert("xss")</script>" | prettier --stdin --parser=html
```
The output should be the following:
```sh
<html>
  <body>
    Hello
    <script>
      alert(xss);
    </script>
  </body>
</html
```
##### Why it works

This is basic string concatenation, the result of which is sent to the browser to be evaluated, something in the Langsec world is referred to as a [forwarding flaw](http://www.cs.ru.nl/~erikpoll/publications/2018_langsec.pdf), but commonly referred to as cross site scripting. 

### React XSS

```sh
npm run react
```
In another terminal run
```sh
curl -s "localhost:3000/?name=<script>alert("xss")</script>" | prettier --stdin --parser=html
```
The output should be the following, properly escaped string:
```sh
<html data-reactroot="">
  <body>
    Hello
    <!-- -->&lt;script&gt;alert(xss)&lt;/script&gt;
  </body>
</html>

```
##### Why it works

React builds a UI out of a tree of nested functions. It uses a build step to allow the developer writes `<body>Hello {name}</body>`, but the [transpiled output](https://babeljs.io/en/repl#?browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=MYewdgzgLgBASgUwIbFgXhgJwQRwK4CW2AFAOTYpSkCUAUKJLAN5YJgAmCmAKiAMpRMBMAHMYAXxgZs-IgjIVUAWnYgAtgHoIXAG5ca9cNBgIAHgAdsECFNaySpM5YTWDDY0nPnbTqxGJ0tJ7mAHQiCFBkGqQANDDEMnguUHFW5kYI1FIAfDBMtDAw7swwYEhqCBK2ickh-FwAnrQFrFB4mGCsEOmQCCFQDebypAAWUGoANjQh2hzELYXYHFy8AkKi84VbMAA8Y5PZC9u7AEYg7A3ZABIIExMgeWUV4jsaZxeHx7sa-xPZMUdqADCnRxIFgiEJgRoGxiABmAAMSOoQA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2&prettier=false&targets=&version=7.8.3&externalPlugins=) shows that this is actually `React.createElement("body", null, "Hello ", name)`. This function knows what proper escaping means for the element it represents, and is able to treat user input accordingly.
As Lee Byron [puts it](https://www.youtube.com/watch?v=NcAYsC_TKCA&feature=youtu.be&t=643), "what we are doing here is building a tree of UI component instances rather than a stream of concatentated strings." When every instance is able to handle inputs correctly, "security is solved by default".


### REST

```sh
npm run rest
```
In another terminal run
```sh
curl -s "localhost:3000/widgets/3%3B%20drop%20table%20widgets%3B%20--" | jq .
```
The output should be the following string:
```sh
{
  "widgets": "select * from widgets where id = 3; drop table widgets; --;"
}
```

##### Why it works

The pattern that traditional frameworks follow is a clarification of ReST called [Resource Oriented Architecture](https://en.wikipedia.org/wiki/Resource-oriented_architecture). In this architecture, developers are encouraged to connect URLs for "resources" (a collection of widgets in our case) to functions that operate on those "resources. The arguments to those functions are drawn from the various parts of the HTTP request: URL segments, POST bodies, header values, query parameters, etc.

A request to `localhost:3000/widgets/3` under this model calls the function is responsible for operating on the widgets resource with a request object representing the HTTP request. The properties of that request object are then used to formulate database queries and do other work. Any meaningful validation of the values in the request object are largely left to the programmer.

This model starts on the wrong foot, with the function receiving data which may, or may not be valid or safe to operate on. From there it's up to the programmer to "do the right thing". Unsurprisingly, what usually happens is concatenating values from the request directly into database commands (aka SQL injection) and forwarding them to the database for evaluation.

As with XSS above, this is a forwarding flaw. The attacker is able to make the database perform a wide variety of surprising computations, none of which the programmers intended.


### GraphQL: getting specific with the integer type

```sh
npm run graphql:int
```
In another terminal run
```sh
curl -sH "Content-Type: application/graphql" -d '{widgets(id:"3; drop table widgets; --")}' localhost:3000 | jq .
```
The output should be the following string:
```sh
{
  "errors": [
    {
      "message": "Expected type Int!, found \"3; drop table widgets; --\".",
      "locations": [
        {
          "line": 1,
          "column": 13
        }
      ]
    }
  ]
}

```

##### Why it works

GraphQL is a formal language. Upon receiving a request purporting to be GraphQL query, the GraphQL library uses a [Lexer](https://github.com/graphql/graphql-js/blob/278bde0a5cd71008452b555065f19dcd1160270a/src/language/lexer.js) to try to [break the string into tokens](https://mikewilliamson.wordpress.com/2019/03/03/exploring-graphql-js/); the graphql equivalent of nouns, verbs and pronouns. It does this by going character by character through the string and will reject the string entirely if it finds things that don't make sense.

From there uses a [parser](https://github.com/graphql/graphql-js/blob/278bde0a5cd71008452b555065f19dcd1160270a/src/language/parser.js) to arrange these tokens into a [tree structure](https://astexplorer.net/#/gist/0f9c98774798c2d4877af034959bfc9c/8617ae9bae69c2d2587a6d0e27da1439c01d4194) and examine this structure to ensure that all parts of the query align with the expectations set by the schema. If they do, the functions supplied by the schema are called with the arguments supplied by the query.  This arrangement makes data validation the first step in processing requests, and the example above shows how being strict about inputs can prevent the exploitation of vulnerable code. 

The code in this demo does the same naive string concatenation but since our GraphQL type system only accepts integers, this code can never be called with a value that would violate those naive assumptions. While it's possible to entirely waste the opportunity for rigourous validation that GraphQL presents by declaring that all inputs accept vague GraphQLString types, the self-describing nature of GraphQL means that security teams can ask endpoints to describe themselves and work with teams to make the types more specific.

### GraphQL: Avoiding user input with enums

Enums allow an interesting possibility to allow users to choose from a restricted set of possible choices. We can do this with an Enum type and mapping the enums to some internal value. 

```javascript
const WIDGET = new GraphQLEnumType({
  name: 'WIDGET',
  values: {
    RED_WIDGET: { value: 'red-widget' },
    GREEN_WIDGET: { value: 'green-widget' },
    BLUE_WIDGET: { value: 'blue-widget' },
  },
})
```

This restricts the user to supplying either `RED_WIDGET`, `GREEN_WIDGET` or `BLUE_WIDGET`. It is not possible to formulate a valid query without one of those values. All other values are are rejected out of hand by the GraphQL parser.

In your terminal run:

```sh
npm run graphql:enum
```

In another terminal run:

```sh
$  curl -sH "Content-Type: application/graphql" -d '{widgets(name: RED_WIDGET)}' localhost:3000 | jq .
```

In the output we can see that `RED_WIDGET` is mapped to it's internal representation.

```sh
{
  "data": {
    "widgets": "select * from widgets where name = 'red-widget';"
  }
}
```

What's interesting here is the possibility to allow people to query your API without accepting any user input at all. Your functions will only ever be called with the values defined in the WIDGET enum.
