const express = require('express'),
      path = require('path'),
      port = process.env.PORT || 3000,
      app = express();

app.use(express.static(path.join(__dirname, '/../public')));

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
