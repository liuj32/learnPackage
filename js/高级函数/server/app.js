const express = require("express")
const app = express()
import proxy from 'express-http-proxy';

app.use(express.static('public'));

app.use('/api/search', proxy('http://localhost:4000', {
  proxyReqPathResolver: function(req) {
	   
  }
}));


app.get("/search",)
app.listen(4001, () => {console.log('running 4001')})