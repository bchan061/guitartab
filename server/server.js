
var express = require('express')
var sqlite3 = require('sqlite3').verbose()
var cors = require('cors')

var app = express()
var db = new sqlite3.Database('./tabs.sqlite')

const port = 3005

app.use(cors())
app.use(express.urlencoded())
app.use(express.json())

app.get('/getAllTabs', function(request, response) {
    let allTabs = []
    db.all('SELECT * FROM tabs',
        function(err, rows) {
            rows.forEach(
                function(row) {
                    let tab = [row['id'], row['artist'], row['title']]
                    allTabs.push(tab)
                    console.log(tab)
                }
            )

            let data = {}
            data['tabs'] = allTabs
        
            response.set('Content-Type', 'text/json')
            response.send(data)
        }
    )
})

app.get('/getTab', function(request, response) {
    let id = request.query['id']
    console.log("Request query: " + JSON.stringify(request.query))
    let data = {}
    let statement = db.prepare('SELECT tab FROM tabs WHERE id = (?) ORDER BY artist, title')
    statement.each(id,
        function(err, row) {
            data['tab'] = row['tab']
        },
        function(err, count) {
            statement.finalize()
            if (err !== null) {
                response.set('Content-Type', 'application/json')
                response.send({ error: err })
            } else {
                response.set('Content-Type', 'application/json')
                response.send(data)
            }
        }
    )
})

app.get('/newTab', function(request, response) {
    let id = request.query['id']
    let statement = db.prepare('SELECT COUNT(id) FROM tabs WHERE id = ?')
    statement.get(id,
        function(err, row) {
            if (err != null) {
                response.set("Content-Type", "application/json")
                let result = {result: 'Error when checking for IDs'}
                response.send(result)
            } else {
                console.log(row)
                let count = row['COUNT(id)']
                console.log(count)
                if (count < 1) {
                    const blankTab = {
                        "title": "Blank Title",
                        "artist": "Blank Artist",
                        "tabber": "Blank Tabber",
                        "bpm": 160,
                        "capo": 0,
                        "id": id,
                        "noteData": [
                            [
                                [-1],
                                [-1],
                                [-1],
                                [-1],
                                [-1],
                                [-1]
                            ]
                        ]
                    }
                    let statement2 = db.prepare(`
                        INSERT INTO tabs VALUES
                        (?, ?, ?, ?)
                    `)
                    statement2.bind(blankTab['id'], blankTab['artist'], blankTab['title'], JSON.stringify(blankTab))
                    statement2.run(function (err) {
                        if (err != null) {
                            response.set("Content-Type", "application/json")
                            let result = {result: 'Error when creating new unique tab with ID'}
                            response.send(result)
                        } else {
                            response.set("Content-Type", "application/json")
                            let result = {result: 'Created new tab with ID ' + id}
                            response.send(result)
                        }
                    })
                } else {
                    response.set("Content-Type", "application/json")
                    let result = {result: 'Tab with ID already exists'}
                    response.send(result)
                }
            }
        }
    )
    statement.finalize()
})

app.get('/createNewTab', function(request, response) {
    let statement = db.prepare('SELECT (MAX(id) + 1) FROM tabs')
    statement.get(
        function(err, row) {
            if (err != null) {
                console.log("Error: " + err)
                response.set("Content-Type", "application/json")
                let result = {result: 'Error when finding the max ID for tabs'}
                response.send(result)
            } else {
                console.log(row)
                if ('(MAX(id) + 1)' in row) {
                    let id = row['(MAX(id) + 1)']
                    const blankTab = {
                        "title": "Blank Title",
                        "artist": "Blank Artist",
                        "tabber": "Blank Tabber",
                        "bpm": 160,
                        "capo": 0,
                        "id": id,
                        "noteData": [
                            [
                                [-1],
                                [-1],
                                [-1],
                                [-1],
                                [-1],
                                [-1]
                            ]
                        ]
                    }
                    let statement2 = db.prepare(`
                        INSERT INTO tabs VALUES
                        (?, ?, ?, ?)
                    `)
                    statement2.bind(blankTab['id'], blankTab['artist'], blankTab['title'], JSON.stringify(blankTab))
                    statement2.run(function (err) {
                        if (err != null) {
                            response.set("Content-Type", "application/json")
                            let result = {result: 'Error when creating new unique tab with ID'}
                            response.send(result)
                        } else {
                            response.set("Content-Type", "application/json")
                            let result = {result: 'Created new tab with ID ' + id}
                            response.send(result)
                        }
                    })
                } else {
                    response.set("Content-Type", "application/json")
                    let result = {result: "Error when finding next ID for tabs"}
                    response.send(result)
                }
            }
        }
    )
    statement.finalize()
})

app.post('/saveTab', function(request, response) {
    console.log(request.body)
    let tab = request.body
    let id = tab['id']
    let title = tab['title']
    let artist = tab['artist']
    if (tab === null || id === null || title === null || artist === null) {
        response.set("Content-Type", "application/json")
        let result = {result: 'Invalid data'}
        response.send(result)
        return
    }
    let statement = db.prepare(`
        UPDATE tabs
        SET title = ?, artist = ?, tab = (?)
        WHERE id = ?
    `)
    statement.bind(title, artist, JSON.stringify(tab), id)
    statement.run(
        function(err) {
            if (err !== null) {
                console.log(err.message)
            }
            console.log("Ran statement: " + JSON.stringify(this))
            response.set("Content-Type", "application/json")
            let result = {result: 'OK'}
            response.send(result)
        }
    )
    statement.finalize()
})

app.listen(port)

process.on('exit', function() {
    db.close()
})
