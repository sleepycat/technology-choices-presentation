# Tech choices

This is a presentation for the report a cybercrime team.

## Code examples

First ensure the dependencies are installed and [jq](https://stedolan.github.io/jq/download/) and	[prettier](https://prettier.io/) installed.

```
npm install
```
	
### XSS

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
### Why it works

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
### Why it works

React builds UI out of a tree of nested functions. Where it appears that we are concatenating user supplied data with strings of html the output of the traspilation process shows [the truth](https://babeljs.io/en/repl#?browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=MYewdgzgLgBASgUwIbFgXhgJwQRwK4CW2AFAOTYpSkCUAUKJLAN5YJgAmCmAKiAMpRMBMAHMYAXxgZs-IgjIVUAWnYgAtgHoIXAG5ca9cNBgIAHgAdsECFNaySpM5YTWDDY0nPnbTqxGJ0tJ7mAHQiCFBkGqQANDDEMnguUHFW5kYI1FIAfDBMtDAw7swwYEhqCBK2ickh-FwAnrQFrFB4mGCsEOmQCCFQDebypAAWUGoANjQh2hzELYXYHFy8AkKi84VbMAA8Y5PZC9u7AEYg7A3ZABIIExMgeWUV4jsaZxeHx7sa-xPZMUdqADCnRxIFgiEJgRoGxiABmAAMSOoQA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2&prettier=false&targets=&version=7.8.3&externalPlugins=).We are actually handing user input into a function that knows what proper escaping means in the context the function represents.


