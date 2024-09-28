// pb_hooks/main.pb.js
// intercept requests
onRecordAfterUpdateRequest((e) => {
    console.log(e.record.id)
})

// register custom routes
routerAdd(
    "get",
    "/hello-admin",
    (c) => {
        return c.string(200, "Hello!")
    },
    $apis.activityLogger($app),
    $apis.requireAdminAuth()
)

routerAdd("GET", "/hello/:name", (c) => {
    let name = c.pathParam("name")

    return c.json(200, { "message": "Hello " + name })
}, /* optional middlewares */)


// jobs scheduling
cronAdd("hello", "*/2 * * * *", () => {
    // prints "Hello!" every 2 minutes
    console.log("Hello!")
})