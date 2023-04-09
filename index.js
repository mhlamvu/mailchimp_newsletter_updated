const express = require('express')
const request = require('request')
const path = require('path')

const app = express()


app.use(express.json({ extended: true }))
app.use(express.urlencoded({ extended: true }))
// Static folder
app.use(express.static(path.join(__dirname, 'public')))


// Signup Route
app.post('/signup', (req, res) => {
    const { firstName, lastName, email } = req.body

    // Validate fields are not empty
    if(!firstName || !lastName || !email) {
        res.redirect('/fail.html')
        return
    }

    // Construct req data
    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const postData = JSON.stringify(data)

    const options = {
        url: 'https://us6.api.mailchimp.com/3.0/lists/6c6ada93e7',
        method: "POST",
        headers: {
            Authorization: 'auth 4facc07a3996a036c900acb9ae62fb92-us6'
        },
        body: postData
    }

    request(options, (err, response, body) => {
        if(err) {
            res.redirect('/fail.html')
        }else {
            if(response.statusCode === 200) {
                res.redirect('/success.html')
            }
            else {
                res.redirect('/fail.html')
            }
        }
    })
})

const port = process.env.PORT || 5000
app.listen(port, console.log(`Server started on port ${port}`))